import type { Vehicle } from '../game/Vehicle';

const WHEEL_CENTER_X = 760;
const WHEEL_CENTER_Y = 850;

/** Responsive cabin trim plus a uniformly scaled instrument panel and steering wheel. */
export class CabinInterior {
    readonly root = document.createElement('div');
    private wheel: SVGGElement;
    private speed: SVGTextElement;
    private rpm: SVGTextElement;
    private gear: SVGTextElement;

    constructor() {
        this.root.className = 'cabin-interior';
        this.root.innerHTML = `
        <svg class="cabin-window-trim" viewBox="0 0 1500 840" preserveAspectRatio="none" aria-hidden="true">
            <!-- Keep the original left-seat perspective: the near door/window
                 sits beside the driver and its A-pillar leans toward the dash. -->
            <path d="M0 0H1500V68L1160 72L314 80L280 105L0 95Z" fill="#292c2e"/>
            <path d="M0 95L280 105L314 80L1160 72L1500 68" fill="none" stroke="#55595b" stroke-width="3"/>
            <path d="M280 105L314 80L526 590L492 601Z" fill="#34383a"/>
            <path d="M301 91L311 84L520 591L510 595Z" fill="#565b5d"/>
            <defs><linearGradient id="cabin-dash-shade" x2="0" y2="1">
                <stop stop-color="#484c4e"/><stop offset=".28" stop-color="#303437"/><stop offset="1" stop-color="#1d2124"/>
            </linearGradient></defs>
            <!-- Door rail, pillar foot and dash share one coordinate system and
                 one continuous surface so resizing cannot separate their joins. -->
            <path d="M0 741L368 530Q420 532 480 548Q520 559 558 578Q930 574 1500 590V840H0Z" fill="url(#cabin-dash-shade)"/>
            <path d="M0 741L368 530Q420 532 480 548Q520 559 558 578Q930 574 1500 590" fill="none" stroke="#696d6f" stroke-width="3"/>
            <path d="M0 797L340 635Q365 629 375 653L390 679L350 840H0Z" fill="#252b2e"/>
            <g transform="translate(0 588) scale(1 .84)">
            <!-- Centre stack is to the driver's right; passenger fascia extends beyond it. -->
            <path d="M954 83L1040 79L1038 99L954 103ZM1051 79L1137 78L1135 98L1050 99Z" fill="#171b1d"/>
            <path d="M961 91L1033 88M1058 88L1129 87" fill="none" stroke="#4b5154" stroke-width="2"/>
            <path d="M950 119L1140 114L1149 232L943 241Z" fill="#252b2f" stroke="#51595d" stroke-width="2"/>
            <path d="M966 134L1125 130L1128 180L963 185Z" fill="#111b21"/>
            <path d="M975 206L1117 202" fill="none" stroke="#7b8489" stroke-width="3"/>
            <path d="M1240 76L1460 72L1448 89L1242 94Z" fill="#171b1d"/>
            <path d="M1253 84L1441 80M1203 181L1490 171M1230 199L1470 190" fill="none" stroke="#1e2427" stroke-width="3"/>
            </g>
        </svg>
        <svg class="cabin-driver-panel" viewBox="430 500 660 440" preserveAspectRatio="xMidYMax meet" role="group" aria-label="Đồng hồ và vô lăng cabin">
            <defs>
                <linearGradient id="cabin-cluster-shade" x2="0" y2="1"><stop stop-color="#363b3e"/><stop offset="1" stop-color="#202629"/></linearGradient>
                <linearGradient id="cabin-wheel-rim" x2="0" y2="1"><stop stop-color="#202427"/><stop offset=".5" stop-color="#454a4d"/><stop offset="1" stop-color="#22272a"/></linearGradient>
            </defs>
            <path d="M480 670Q505 511 760 511Q1015 511 1040 670L993 680H527Z" fill="url(#cabin-cluster-shade)" stroke="#1a2023" stroke-width="6"/>
            <rect x="600" y="535" width="320" height="110" rx="30" fill="#10191f" stroke="#53616a" stroke-width="3"/>
            <g fill="none" stroke="#80949e" stroke-width="3">
                <path d="M635 615A41 41 0 1 1 695 615"/><path d="M825 615A41 41 0 1 1 885 615"/>
            </g>
            <g fill="#abbcc4" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">
                <text x="665" y="566">RPM</text><text x="855" y="566">KM/H</text>
            </g>
            <g font-family="monospace" text-anchor="middle" dominant-baseline="middle">
                <text class="interior-rpm" x="665" y="594" font-size="18">0</text>
                <rect x="743" y="576" width="34" height="36" rx="5" fill="#203945"/>
                <text class="interior-gear" x="760" y="595" font-size="22">N</text>
                <text class="interior-speed" x="855" y="594" font-size="22">0</text>
            </g>
            <g id="interior-wheel" transform="rotate(0 ${WHEEL_CENTER_X} ${WHEEL_CENTER_Y})">
                <g transform="translate(${WHEEL_CENTER_X} ${WHEEL_CENTER_Y}) scale(0.78) translate(-760 -785)">
                    <circle cx="760" cy="785" r="282" fill="none" stroke="#101517" stroke-width="41"/>
                    <circle cx="760" cy="785" r="282" fill="none" stroke="url(#cabin-wheel-rim)" stroke-width="30"/>
                    <path d="M493 737L705 759L717 805L512 792M1008 737L815 759L803 805L1000 798M726 811L704 1052H812L793 811" fill="#454b4e" stroke="#20272b" stroke-width="8"/>
                    <ellipse cx="760" cy="790" rx="95" ry="67" fill="url(#cabin-cluster-shade)" stroke="#242d32" stroke-width="3"/>
                    <g fill="none" stroke="#aeb8bd" stroke-width="3"><ellipse cx="760" cy="782" rx="27" ry="17"/><ellipse cx="760" cy="780" rx="10" ry="18"/><path d="M734 776Q760 790 786 776"/></g>
                </g>
            </g>
            <circle id="cabinWheelControl" class="cabin-wheel-control" cx="760" cy="850" r="235"
                fill="transparent" role="slider" tabindex="0" aria-label="Vô lăng — kéo để lái, phím trái phải để điều chỉnh"
                aria-valuemin="-540" aria-valuemax="540" aria-valuenow="0"/>
        </svg>`;
        this.wheel = this.root.querySelector<SVGGElement>('#interior-wheel')!;
        this.speed = this.root.querySelector<SVGTextElement>('.interior-speed')!;
        this.rpm = this.root.querySelector<SVGTextElement>('.interior-rpm')!;
        this.gear = this.root.querySelector<SVGTextElement>('.interior-gear')!;
    }

    update(vehicle: Vehicle, steeringWheelAngle: number) {
        this.wheel.setAttribute('transform', `rotate(${steeringWheelAngle} ${WHEEL_CENTER_X} ${WHEEL_CENTER_Y})`);
        this.speed.textContent = String(Math.round(vehicle.getSpeedKmh()));
        this.rpm.textContent = String(vehicle.transmission.rpm);
        this.gear.textContent = vehicle.transmission.gear === 0 ? 'N' : vehicle.transmission.gear < 0 ? 'R' : String(vehicle.transmission.gear);
    }
}
