import './style.css';
import {DrivingGame} from './game/DrivingGame';
import {Hud} from './ui/Hud';
import {Vehicle3} from './game/Vehicle3';
import { Vehicle2 } from './game/Vehicle2';
import { StopSign } from './game/StopSign';
import { RailwayCrossingRoad } from './game/RailwayCrossingRoad';

const gameHost=document.querySelector<HTMLDivElement>('#game');
const hudHost=document.querySelector<HTMLDivElement>('#hud');

if(!gameHost||!hudHost)throw new Error('Missing host');

const develop = new URLSearchParams(window.location.search).get('develop') === 'true';
const hud = new Hud(hudHost, { develop });
async function start() {
    try {
        // Preload assets in parallel: vehicle GLB + stop sign GLB + railway track GLB.
        // All must finish BEFORE DrivingGame is constructed because its Track creates
        // StopSign and RailwayCrossingRoad instances synchronously and relies on preload() cache.
        const wantsVehicle3 = new URLSearchParams(window.location.search).get('vehicle') === '3';
        const [vehicle] = await Promise.all([
            wantsVehicle3 ? Vehicle3.create() : Promise.resolve(undefined),
            StopSign.preload(),
            RailwayCrossingRoad.preload()
        ]);
        const game=new DrivingGame(gameHost!,hud,vehicle);
        game.start();
    } catch (error) {
        console.error('Unable to start game', error);
        gameHost!.textContent = 'Không tải được xe 3D. Vui lòng tải lại trang hoặc kiểm tra file GLB.';
    }
}
void start();
