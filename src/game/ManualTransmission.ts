import type { InputManager } from './InputManager';
import { ManualCar } from './drivetrain/ManualCar';
import { Pedals } from './drivetrain/Pedals';
import { manualConfig } from './drivetrain/config';
import { notify } from '../ui/Notify';

const SPEED_CAP_CLUTCH_PEDAL = .38;

/** Simplified manual drivetrain; clutch release is gradual for keyboard controls. */
export class ManualTransmission {
    car = new ManualCar();
    pedals = new Pedals();
    get running() { return this.car.engine.running; }
    get gear() { return this.car.gearbox.gear; }
    set gear(value: number) { this.car.gearbox.gear = value; }
    get clutch() { return this.car.clutch.pedal; }
    get rpm() { return Math.round(this.car.engine.rpm); }
    status = 'Máy tắt';
    private held = new Set<string>();


    reset() {
        this.car = new ManualCar(); this.status = 'Máy tắt';
        this.pedals = new Pedals();
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
        const driverClutchTarget = pedal ? 1 : input.getAnalog('clutch') ?? 0;
        // A course speed cap can be slower than first-gear idle. Slip the clutch
        // while that artificial cap is active so it cannot stall the engine.
        const cappedBelowIdle = this.running && this.gear !== 0
            && Number.isFinite(speedLimitMps)
            && Math.abs(this.car.gearbox.rpm(speedLimitMps)) < manualConfig.idleRPM;
        const clutchTarget = Math.max(driverClutchTarget,
            cappedBelowIdle ? SPEED_CAP_CLUTCH_PEDAL : 0);
        // Đạp côn là tức thời, nên phím Shift và Enter/số trong cùng khung hình vẫn hợp lệ.
        const effectiveClutch = Math.max(this.clutch, clutchTarget);

        if (pressed('Enter')) {
            if (this.running) { this.car.engine.stop(); this.status = 'Máy tắt'; }
            else if (this.gear === 0 && effectiveClutch >= 1 - 1e-6) {
                this.car.engine.start();
                this.status = 'Máy đang chạy';
                // notify.show(
                //     'Chào mừng bạn đến bài thi, hãy đưa xe đến vị trí xuất phát.',
                //     { kind: 'exam', persist: true }
                // );
            }
            else this.status = 'Về số N và đạp hết côn (100%), rồi nhấn Enter';
        }
        for (const [code, gear] of [['KeyN', 0], ['KeyR', -1], ['Digit1', 1], ['Digit2', 2], ['Digit3', 3], ['Digit4', 4], ['Digit5', 5]] as const) {
            if (!pressed(code)) continue;
            if (effectiveClutch < manualConfig.biteStart) { this.status = 'Đạp côn ít nhất 50% để sang số'; continue; }
            if ((gear === -1 && speed > .1) || (gear > 0 && speed < -.1)) {
                this.status = 'Dừng xe trước khi đổi chiều'; continue;
            }
            this.gear = gear;
            this.status = this.running ? 'Máy đang chạy' : 'Máy tắt';
        }
        const gas = input.isDown('KeyW') || input.isDown('ArrowUp');
        const brake = input.isDown('KeyS') || input.isDown('ArrowDown') || input.isDown('Space');
        this.pedals.update(dt, gas ? 1 : input.getAnalog('gas') ?? 0, brake ? 1 : 0);
        this.car.physics.speed = speed;
        this.car.update(dt, this.pedals.gas,
            clutchTarget, input.isDown('KeyF'), this.pedals.brake, slope);
        if (this.car.stalled) this.status = 'Chết máy — về N, đạp hết côn rồi nhấn Enter';
        else if (this.car.clutch.riding && !cappedBelowIdle) this.status = 'Đang rà côn';
        else if (this.status === 'Đang rà côn') this.status = this.running ? 'Máy đang chạy' : 'Máy tắt';
        return this.car.physics.speed;
    }
}
