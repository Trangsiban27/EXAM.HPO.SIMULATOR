import type { Vehicle } from '../game/Vehicle';

/** Screen-space interior artwork; vehicle state only drives the instruments. */
export class CabinInterior {
    readonly root = document.createElement('div');
    private wheel: SVGGElement;
    private speed: HTMLElement;
    private rpm: HTMLElement;
    private gear: HTMLElement;
    constructor() {
        this.root.className = 'cabin-interior';
        this.root.innerHTML = `<svg viewBox="0 0 1500 840" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="dashShade" x2="0" y2="1"><stop stop-color="#17191a"/><stop offset=".3" stop-color="#424344"/><stop offset="1" stop-color="#222526"/></linearGradient><linearGradient id="rimShade"><stop stop-color="#19191c"/><stop offset=".5" stop-color="#484448"/><stop offset="1" stop-color="#151619"/></linearGradient></defs>
        <path d="M0 0H1500V164L1120 168L1108 162L330 168L285 206L0 142Z" fill="#090b0c"/>
        <path d="M1110 158L1140 264Q1280 293 1500 246V100Z" fill="#101213"/>
        <path d="M0 179L285 180L493 555L367 526L0 340Z" fill="#111314"/>
        <path d="M285 201L328 166L518 547L487 559Z" fill="#292b2d"/>
        <path d="M306 199L328 166L518 547L500 550Z" fill="#373839" opacity=".5"/>
        <path d="M0 741L368 530L524 555L476 840H0Z" fill="#282d30"/>
        <path d="M0 795L359 613L391 674L350 840H0Z" fill="#11171a"/>
        <path d="M370 744L520 548Q745 509 965 535L1500 547V840H438Z" fill="url(#dashShade)"/>
        <path d="M514 550Q751 520 964 539L1500 551" fill="none" stroke="#858887" stroke-width="5"/>
        <path d="M1010 557L1458 565L1437 574L1001 566Z" fill="#101417"/>
        <path d="M523 666Q749 527 1020 645L1090 716L1500 711V817H430Z" fill="#363839"/>
        <path d="M1080 724H1490M1140 743H1440" stroke="#202426" stroke-width="3"/>
        <rect x="627" y="559" width="277" height="86" rx="7" fill="#03090e" stroke="#354450" stroke-width="3"/>
        <g fill="none" stroke="#52616d" stroke-width="4"><path d="M655 624A30 30 0 1 1 702 624"/><path d="M830 624A30 30 0 1 1 877 624"/></g>
        <g fill="#dbe7ed" font-family="Arial" font-size="9"><text x="667" y="580">RPM</text><text x="841" y="580">KM/H</text></g>
        <g id="interior-wheel" transform="rotate(0 760 785)"><circle cx="760" cy="785" r="282" fill="none" stroke="#0b0d0e" stroke-width="41"/><circle cx="760" cy="785" r="282" fill="none" stroke="url(#rimShade)" stroke-width="30"/>
        <path d="M493 737L705 759L717 805L512 792M1008 737L815 759L803 805L1000 798M726 811L704 1052H812L793 811" fill="#383a3e" stroke="#191c20" stroke-width="8"/>
        <ellipse cx="760" cy="790" rx="95" ry="67" fill="url(#dashShade)" stroke="#22272b" stroke-width="3"/></g>
        </svg><div class="interior-readout"><span class="interior-rpm">0</span><span class="interior-gear">N</span><span class="interior-speed">0</span></div>`;
        this.wheel=this.root.querySelector('#interior-wheel')!;
        this.speed=this.root.querySelector('.interior-speed')!;
        this.rpm=this.root.querySelector('.interior-rpm')!;
        this.gear=this.root.querySelector('.interior-gear')!;
    }
    update(vehicle: Vehicle, steeringWheelAngle: number) {
        this.wheel.setAttribute('transform',`rotate(${steeringWheelAngle} 760 785)`);
        this.speed.textContent=String(Math.round(vehicle.getSpeedKmh()));
        this.rpm.textContent=String(vehicle.transmission.rpm);
        this.gear.textContent=vehicle.transmission.gear===0?'N':vehicle.transmission.gear<0?'R':String(vehicle.transmission.gear);
    }
}
