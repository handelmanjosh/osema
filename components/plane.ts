import { GRAVITY } from "./game";

const PLANE_WIDTH = 80;
const planeWidthToHeight = 150 / 403;
const PLANE_HEIGHT = PLANE_WIDTH * planeWidthToHeight;
export default class Plane {
    y: number;
    dy: number;
    angle: number;
    x: number;
    constructor(canvas: HTMLCanvasElement) {
        this.y = 0;
        this.dy = 0;
        this.angle = 0;
        this.x = canvas.width * 1 / 6;
    }
    jump() {
        this.dy = -GRAVITY;
        this.angle = Math.PI / 4;
    }
    update(canvas: HTMLCanvasElement, dead: boolean) {
        console.log(dead);
        if (dead) {
            this.angle = 0;
        } else {
            this.y += this.dy;
            this.dy = Math.min(this.dy + 0.2, GRAVITY);
            this.angle = Math.max(this.angle - 0.03, -Math.PI / 4);
            if (this.y > canvas.height /2) this.y = canvas.height / 2;
            if (this.y < - canvas.height / 2) this.y = - canvas.height / 2;
        }
    }
    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, img: HTMLImageElement) {
        if (img.src === "") return;
        if (!img.src.includes("explosion")) {
            context.save();
            context.translate(this.x, canvas.height / 2 + this.y);
            context.rotate(- this.angle);
            context.drawImage(img, -PLANE_WIDTH / 2, - PLANE_HEIGHT / 2, PLANE_WIDTH, PLANE_HEIGHT);
            context.restore();
        } else {
            context.save();
            context.translate(this.x, canvas.height / 2 + this.y);
            context.drawImage(img, -PLANE_WIDTH / 2, - PLANE_WIDTH / 2, PLANE_WIDTH, PLANE_WIDTH);
            context.restore(); 
        }
    }
}   