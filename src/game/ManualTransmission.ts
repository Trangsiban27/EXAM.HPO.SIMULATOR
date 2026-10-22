import type { InputManager } from './InputManager';
import { ManualCar } from './drivetrain/ManualCar';
import { Pedals } from './drivetrain/Pedals';
import { manualConfig } from './drivetrain/config';
import { notify } from '../ui/Notify';

const SPEED_CAP_CLUTCH_PEDAL = .38;

/** Slow clutch release for first-gear starts; quick release in higher forward gears. */
export class ManualTransmission {
    car = new ManualCar();
    pedals = new Pedals();
    get running() { return this.car.engine.running; }
    get gear() { return this.car.gearbox.gear; }
    set gear(value: number) { this.car.gearbox.gear = value; }
    get clutch() { return this.car.clutch.pedal; }
    get rpm() { return Math.round(this.car.engine.rpm); }
    status = 'Máy tắt';
    preventStall = false;
    isAutomatic = false;
    private held = new Set<string>();
    private holdingPosition = false;

    stopInPlace(input: InputManager): void {
        this.gear = 0;
        this.car.physics.speed = 0;
        this.car.engine.start();
        this.car.stalled = false;
        this.car.warnings = [];
        this.car.clutch.update(1 / 240, 1, false);
        this.pedals.gas = 0;
        this.pedals.brake = 1;
        this.holdingPosition = true;
        this.status = 'Máy đang chạy';
        for (const code of ['Enter', 'KeyN', 'KeyR', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5']) {
            if (input.isDown(code)) this.held.add(code); else this.held.delete(code);
        }
    }

    reset() {
        this.holdingPosition = false;
        const wasAuto = this.isAutomatic;
        this.car = new ManualCar(); this.status = 'Máy tắt';
        this.pedals = new Pedals();
        this.preventStall = wasAuto;
        this.isAutomatic = wasAuto;
        // Preserve held keys so restarting does not retrigger ignition.
    }

    update(dt: number, input: InputManager, speed: number, slope = 0,
        speedLimitMps = Infinity): number {
        const pressed = (code: string) => {
            const down = input.isDown(code), fresh = down && !this.held.has(code);
            if (down) this.held.add(code); else this.held.delete(code);
            return fresh;
        };
        const pedal = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
        const driverClutchTarget = this.isAutomatic
            ? ((Math.abs(speed) < 0.25 && !(input.isDown('KeyW') || input.isDown('ArrowUp'))) ? 1 : 0)
            : (pedal ? 1 : input.getAnalog('clutch') ?? 0);
        // A course speed cap can be slower than first-gear idle. Slip the clutch
        // while that artificial cap is active so it cannot stall the engine.
        const cappedBelowIdle = this.running && this.gear !== 0
            && Number.isFinite(speedLimitMps)
            && Math.abs(this.car.gearbox.rpm(speedLimitMps)) < manualConfig.idleRPM;
        const gas = input.isDown('KeyW') || input.isDown('ArrowUp');
        if (gas || (input.getAnalog('gas') ?? 0) > .01) this.holdingPosition = false;
        const clutchTarget = Math.max(driverClutchTarget, this.holdingPosition ? 1 : 0,
            (cappedBelowIdle || (this.isAutomatic && Math.abs(speed) < 0.25)) ? SPEED_CAP_CLUTCH_PEDAL : 0);
        // Đạp côn là tức thời, nên phím Shift và Enter/số trong cùng khung hình vẫn hợp lệ.
        const effectiveClutch = this.isAutomatic ? 1 : Math.max(this.clutch, clutchTarget);

        const brake = input.isDown('KeyS') || input.isDown('ArrowDown') || input.isDown('Space');

        if (this.isAutomatic && gas && !this.running) {
            this.car.engine.start();
            if (this.gear === 0) this.gear = 1;
            this.status = 'Máy đang chạy (Số tự động)';
        }

        if (pressed('Enter')) {
            if (this.running) { this.car.engine.stop(); this.status = 'Máy tắt'; }
            else if (this.isAutomatic || (this.gear === 0 && effectiveClutch >= 1 - 1e-6)) {
                this.car.engine.start();
                if (this.isAutomatic && this.gear === 0) this.gear = 1;
                this.status = this.isAutomatic ? 'Máy đang chạy (Số tự động)' : 'Máy đang chạy';
            }
            else this.status = 'Về số N và đạp hết côn (100%), rồi nhấn Enter';
        }
        for (const [code, gear] of [['KeyN', 0], ['KeyR', -1], ['Digit1', 1], ['Digit2', 2], ['Digit3', 3], ['Digit4', 4], ['Digit5', 5], ['KeyD', 1]] as const) {
            if (!pressed(code)) continue;
            if (!this.isAutomatic && effectiveClutch < manualConfig.biteStart) { this.status = 'Đạp côn ít nhất 50% để sang số'; continue; }
            if ((gear === -1 && speed > .1) || (gear > 0 && speed < -.1)) {
                this.status = 'Dừng xe trước khi đổi chiều'; continue;
            }
            this.gear = gear;
            this.status = this.running ? (this.isAutomatic ? 'Máy đang chạy (Số tự động)' : 'Máy đang chạy') : 'Máy tắt';
        }
        this.pedals.update(dt, gas ? 1 : input.getAnalog('gas') ?? 0, brake || this.holdingPosition ? 1 : 0);
        this.car.physics.speed = speed;
        const fastClutchRelease = this.gear > 1 || input.isDown('KeyF') || this.isAutomatic;
        this.car.update(dt, this.pedals.gas,
            clutchTarget, fastClutchRelease, this.pedals.brake, slope, this.preventStall || this.isAutomatic);
        if (this.holdingPosition) this.car.physics.speed = 0;
        if (this.car.stalled) this.status = 'Chết máy — về N, đạp hết côn rồi nhấn Enter';
        else if (this.car.clutch.riding && !cappedBelowIdle && !this.isAutomatic) this.status = 'Đang rà côn';
        else if (this.status === 'Đang rà côn') this.status = this.running ? 'Máy đang chạy' : 'Máy tắt';
        return this.car.physics.speed;
    }
}
