import { VX } from "./game";

export const PILLAR_WIDTH = 50;
export const PILLAR_GAP = 150;
export default class Pillar {
    x: number;
    height: number;
    marked: boolean;
    constructor(x: number, height: number) {
        this.x = x;
        this.height = height;
        this.marked = false;
    }
    update() {
        this.x += VX;
    }
    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, pillar: HTMLImageElement) {
        context.drawImage(pillar, this.x - PILLAR_WIDTH / 2, canvas.height - this.height, PILLAR_WIDTH, this.height);
        const otherHeight = canvas.height - (this.height + PILLAR_GAP);
        context.save();
        context.translate(this.x, otherHeight);
        context.rotate(Math.PI);
        context.drawImage(pillar, - PILLAR_WIDTH / 2, 0, PILLAR_WIDTH, otherHeight);
        context.restore();
    }
}