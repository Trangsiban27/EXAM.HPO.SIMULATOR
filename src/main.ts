import './style.css';
import {DrivingGame} from './game/DrivingGame';
import {Hud} from './ui/Hud';
import {Vehicle3} from './game/Vehicle3';
import { Vehicle2 } from './game/Vehicle2';

const gameHost=document.querySelector<HTMLDivElement>('#game');
const hudHost=document.querySelector<HTMLDivElement>('#hud');

if(!gameHost||!hudHost)throw new Error('Missing host');

const develop = new URLSearchParams(window.location.search).get('develop') === 'true';
const hud = new Hud(hudHost, { develop });
async function start() {
    try {
        const vehicle = new URLSearchParams(window.location.search).get('vehicle') === '3'
            ? await Vehicle3.create() : undefined;
        const game=new DrivingGame(gameHost!,hud,vehicle);
        game.start();
    } catch (error) {
        console.error('Unable to start game', error);
        gameHost!.textContent = 'Không tải được xe 3D. Vui lòng tải lại trang hoặc kiểm tra file GLB.';
    }
}
void start();
