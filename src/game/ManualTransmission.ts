import type { InputManager } from './InputManager';
import { ManualCar } from './drivetrain/ManualCar';
import { Pedals } from './drivetrain/Pedals';
import { notify } from '../ui/Notify';

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

    update(dt: number, input: InputManager, speed: number, slope = 0): number {
        const pressed = (code: string) => {
            const down = input.isDown(code), fresh = down && !this.held.has(code);
            if (down) this.held.add(code); else this.held.delete(code);
            return fresh;
        };
        const pedal = input.isDown('ShiftLeft') || input.isDown('ShiftRight');

        if (pressed('Enter')) {
            if (this.running) { this.car.engine.stop(); this.status = 'Máy tắt'; }
            else if (this.gear === 0 && this.clutch >= 1 - 1e-6) {
                this.car.engine.start();
                this.status = 'Máy đang chạy';
                // notify.show(
                //     'Chào mừng bạn đến bài thi, hãy đưa xe đến vị trí xuất phát.',
                //     { kind: 'exam', persist: true }
                // );
            }
            else this.status = 'Về số N và đạp hết côn (thanh 0%), rồi nhấn Enter';
        }
        for (const [code, gear] of [['KeyN', 0], ['KeyR', -1], ['Digit1', 1], ['Digit2', 2], ['Digit3', 3], ['Digit4', 4], ['Digit5', 5]] as const) {
            if (!pressed(code)) continue;
            if (this.car.clutch.engagement > .001) { this.status = 'Đạp côn xuống mức 50% hoặc thấp hơn để sang số'; continue; }
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
            pedal ? 1 : input.getAnalog('clutch') ?? 0, input.isDown('KeyF'), this.pedals.brake, slope);
        if (this.car.stalled) this.status = 'Chết máy — về N, đạp hết côn rồi nhấn Enter';
        else if (this.car.clutch.riding) this.status = 'Đang rà côn';
        else if (this.status === 'Đang rà côn') this.status = this.running ? 'Máy đang chạy' : 'Máy tắt';
        return this.car.physics.speed;
    }
}
