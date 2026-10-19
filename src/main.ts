import './style.css';
import {DrivingGame} from './game/DrivingGame';
import {Hud} from './ui/Hud';
import {Vehicle3} from './game/Vehicle3';
import { Vehicle2 } from './game/Vehicle2';
import { StopSign } from './game/signs/StopSign';
import { StackedPedestrianStopSign } from './game/signs/StackedPedestrianStopSign';
import { StackedRailwayStopSign } from './game/signs/StackedRailwayStopSign';
import { UphillWarningSign } from './game/signs/UphillWarningSign';
import { DownhillWarningSign } from './game/signs/DownhillWarningSign';
import { WindingCourseClassSign } from './game/signs/WindingCourseClassSign';
import { Exam05JunctionSigns } from './game/signs/Exam05JunctionSigns';
import { Exam05TurnJunctionSigns } from './game/signs/Exam05TurnJunctionSigns';
import { SpeedLimit20EndAccelerationSign } from './game/signs/SpeedLimit20EndAccelerationSign';
import { MinimumSpeed20StartDecelerationSign } from './game/signs/MinimumSpeed20StartDecelerationSign';
import { RailwayCrossingRoad } from './game/RailwayCrossingRoad';

const gameHost=document.querySelector<HTMLDivElement>('#game');
const hudHost=document.querySelector<HTMLDivElement>('#hud');

if(!gameHost||!hudHost)throw new Error('Missing host');

const develop = new URLSearchParams(window.location.search).get('develop') === 'true';
const hud = new Hud(hudHost, { develop });
async function start() {
    try {
        // Preload models before Track builds roadside signs and the railway crossing.
        const vehicleParam = new URLSearchParams(window.location.search).get('vehicle');
        const wantsVehicle3 = vehicleParam === '3' || vehicleParam === null;
        const tasks: [string, Promise<any>][] = [
            ['Vehicle3', wantsVehicle3 ? Vehicle3.create() : Promise.resolve(undefined)],
            ['StopSign', StopSign.preload()],
            ['StackedPedestrianStopSign', StackedPedestrianStopSign.preload()],
            ['StackedRailwayStopSign', StackedRailwayStopSign.preload()],
            ['UphillWarningSign', UphillWarningSign.preload()],
            ['DownhillWarningSign', DownhillWarningSign.preload()],
            ['WindingCourseClassSign', WindingCourseClassSign.preload()],
            ['Exam05JunctionSigns', Exam05JunctionSigns.preload()],
            ['Exam05TurnJunctionSigns', Exam05TurnJunctionSigns.preload()],
            ['SpeedLimit20EndAccelerationSign', SpeedLimit20EndAccelerationSign.preload()],
            ['MinimumSpeed20StartDecelerationSign', MinimumSpeed20StartDecelerationSign.preload()],
            ['RailwayCrossingRoad', RailwayCrossingRoad.preload()]
        ];
        const results = await Promise.all(
            tasks.map(async ([name, p]) => {
                try {
                    return await p;
                } catch (err) {
                    throw new Error(`Failed loading ${name}: ${(err as Error)?.message || err}`);
                }
            })
        );
        const vehicle = results[0];
        const game=new DrivingGame(gameHost!,hud,vehicle);
        game.start();
    } catch (error) {
        console.error('Unable to start game', error);
        const detail = error instanceof Error ? error.message : String(error);
        gameHost!.textContent = `Không tải được tài nguyên 3D (${detail}). Vui lòng tải lại trang hoặc kiểm tra file GLB.`;
    }
}
void start();
