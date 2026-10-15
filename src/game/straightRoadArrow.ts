import * as THREE from 'three';

export type RoadArrowType = 'straight' | 'straight-right' | 'left' | 'right'
    | 'diagonal-left' | 'diagonal-right';

// Cùng một khung hình cho mọi mũi tên: kích thước đầu và thân không đổi khi đổi hướng.
export const STRAIGHT_ROAD_ARROW_WIDTH_M = 1.85;
export const STRAIGHT_ROAD_ARROW_LENGTH_M = 3.4;

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 512;
const SHAFT_WIDTH = 42;
const HEAD_WIDTH = 110;
const HEAD_LENGTH = 75;

type Point = { x: number; y: number };

function drawShaft(ctx: CanvasRenderingContext2D, points: Point[]): void {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
    ctx.lineWidth = SHAFT_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function drawHead(ctx: CanvasRenderingContext2D, tip: Point, angleRad: number): Point {
    const forwardX = Math.cos(angleRad);
    const forwardY = Math.sin(angleRad);
    const base = {
        x: tip.x - forwardX * HEAD_LENGTH,
        y: tip.y - forwardY * HEAD_LENGTH,
    };
    const normalX = -forwardY * HEAD_WIDTH / 2;
    const normalY = forwardX * HEAD_WIDTH / 2;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(base.x + normalX, base.y + normalY);
    ctx.lineTo(base.x - normalX, base.y - normalY);
    ctx.closePath();
    ctx.fill();
    return base;
}

function drawStraight(ctx: CanvasRenderingContext2D, centerX = 128): void {
    const base = { x: centerX, y: 90 + HEAD_LENGTH };
    drawShaft(ctx, [{ x: centerX, y: 420 }, base]);
    drawHead(ctx, { x: centerX, y: 90 }, -Math.PI / 2);
}

function drawTurn(ctx: CanvasRenderingContext2D): void {
    const stemX = 95;
    const tip = { x: 235, y: 185 };
    const base = { x: tip.x - HEAD_LENGTH, y: tip.y };
    drawShaft(ctx, [{ x: stemX, y: 420 }, { x: stemX, y: 185 }, base]);
    drawHead(ctx, tip, 0);
}

function drawDiagonal(ctx: CanvasRenderingContext2D, angleRad: number): void {
    const angle = THREE.MathUtils.clamp(angleRad, THREE.MathUtils.degToRad(15), Math.PI / 4);
    const base = { x: 155, y: 260 - 45 * Math.tan(angle) };
    const tip = {
        x: base.x + HEAD_LENGTH * Math.cos(angle),
        y: base.y - HEAD_LENGTH * Math.sin(angle),
    };
    drawShaft(ctx, [{ x: 110, y: 420 }, { x: 110, y: 260 }, base]);
    drawHead(ctx, tip, -angle);
}

function drawStraightRight(ctx: CanvasRenderingContext2D): void {
    const stemX = 108;
    drawStraight(ctx, stemX);
    const angle = Math.PI / 4;
    const tip = { x: 245, y: 188 };
    const base = {
        x: tip.x - HEAD_LENGTH * Math.cos(angle),
        y: tip.y + HEAD_LENGTH * Math.sin(angle),
    };
    // Nhánh rẽ nối vào thân chính theo đúng góc của đầu mũi tên.
    const join = { x: stemX, y: base.y + base.x - stemX };
    drawShaft(ctx, [join, base]);
    drawHead(ctx, tip, -angle);
}

export function createRoadArrowTexture(
    type: RoadArrowType,
    diagonalAngleRad = Math.PI / 4,
): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot draw road arrow');
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    if (type === 'left' || type === 'diagonal-left') {
        ctx.translate(CANVAS_WIDTH, 0);
        ctx.scale(-1, 1);
    }
    if (type === 'straight') drawStraight(ctx);
    else if (type === 'straight-right') drawStraightRight(ctx);
    else if (type === 'left' || type === 'right') drawTurn(ctx);
    else drawDiagonal(ctx, diagonalAngleRad);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    // Arrows are viewed at a shallow angle from the moving follow camera;
    // anisotropic filtering reduces shimmer as the texture becomes minified.
    texture.anisotropy = 8;
    return texture;
}

export function createStraightRoadArrowTexture(): THREE.CanvasTexture {
    return createRoadArrowTexture('straight');
}
