export const steeringConfig = {
    maxSteeringWheelAngle: 540, maxRoadWheelAngle: 38,
    steeringSpeed: 750, steeringReturnStrength: .8,
    wheelBase: 2.55, trackWidth: 1.88, wheelRadius: .36,
};
const rad = Math.PI / 180;
const clamp = (x: number, m: number) => Math.max(-m, Math.min(m, x));
export class SteeringSystem {
    steeringWheelAngle = 0;
    centerSteerAngle = 0;
    frontLeftAngle = 0;
    frontRightAngle = 0;
    reset() { this.steeringWheelAngle = 0; this.calculateAckermann(); }
    update(dt: number, direction: number, speed: number, target?: number) {
        if (direction) this.steeringWheelAngle += direction * steeringConfig.steeringSpeed * dt;
        else if (target !== undefined) this.steeringWheelAngle += clamp(target - this.steeringWheelAngle, steeringConfig.steeringSpeed * dt);
        else this.steeringWheelAngle *= Math.exp(-Math.abs(speed) * steeringConfig.steeringReturnStrength * dt);
        this.steeringWheelAngle = clamp(this.steeringWheelAngle, steeringConfig.maxSteeringWheelAngle);
        this.calculateAckermann();
    }
    private calculateAckermann() {
        this.centerSteerAngle = this.steeringWheelAngle / steeringConfig.maxSteeringWheelAngle * steeringConfig.maxRoadWheelAngle * rad;
        if (Math.abs(this.centerSteerAngle) < 1e-8) { this.frontLeftAngle = this.frontRightAngle = 0; return; }
        const radius = steeringConfig.wheelBase / Math.tan(Math.abs(this.centerSteerAngle));
        const inner = Math.atan(steeringConfig.wheelBase / (radius - steeringConfig.trackWidth / 2));
        const outer = Math.atan(steeringConfig.wheelBase / (radius + steeringConfig.trackWidth / 2));
        this.frontLeftAngle = this.centerSteerAngle < 0 ? -inner : outer;
        this.frontRightAngle = this.centerSteerAngle < 0 ? -outer : inner;
    }
}

/** Project convention: forward is local -Z, positive steering turns right. */
export function advanceVehicle(x: number, z: number, heading: number, speed: number, angle: number, dt: number) {
    const yaw = -speed / steeringConfig.wheelBase * Math.tan(angle);
    const next = heading + yaw * dt;
    if (Math.abs(yaw) < 1e-8) return { x: x - Math.sin(heading) * speed * dt, z: z - Math.cos(heading) * speed * dt, heading: next };
    return { x: x + speed / yaw * (Math.cos(next) - Math.cos(heading)), z: z - speed / yaw * (Math.sin(next) - Math.sin(heading)), heading: next };
}
