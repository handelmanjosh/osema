import Pillar, { PILLAR_GAP, PILLAR_WIDTH } from "./pillar";
import Plane from "./plane";

export const GRAVITY = 6;
export const VX = -2.5;
export const bgHeightToWidth = 1;
function randomBetween(a: number, b: number) {
    return a + (Math.random() * (b - a));
}
export default class Game {
    plane: Plane;
    pillars: Pillar[];
    startX: number;
    startY: number;
    planeImg: HTMLImageElement;
    pillarImg: HTMLImageElement;
    backgroundImg: HTMLImageElement;
    explosionImgs: HTMLImageElement[];
    currX: number;
    dead: boolean;
    end: () => void;
    updateScore: () => void;
    constructor(canvas: HTMLCanvasElement, end: () => void, updateScore: () => void) {
        this.plane = new Plane(canvas);
        this.pillars = [];
        this.startX = canvas.width * 5 / 6;
        this.startY = canvas.height / 2;
        this.dead = false;
        for (let i = 0; i < 2; i++) {
            this.pillars.push(
                new Pillar(
                    (i + 2) * (canvas.width == 600 ? 350 : 175),
                    randomBetween(canvas.height / 6, canvas.height * 5 / 6)
                )
            )
        }
        this.end = end;
        this.updateScore = updateScore;
        this.planeImg = document.createElement("img");
        this.pillarImg = document.createElement("img");
        this.backgroundImg = document.createElement("img");
        this.explosionImgs = [];
        this.planeImg.src = "/plane.png";
        this.pillarImg.src = "/building.png";
        this.backgroundImg.src = "/background.png";
        for (let i = 0; i < 5; i++) {
            const img = document.createElement("img")
            img.src = `/explosions/explosion${i}.png`;
            this.explosionImgs.push(img);
        }
        this.currX = 0;
    }
    update(canvas: HTMLCanvasElement) {
        if (!this.dead) {
            this.currX = -((-(this.currX + VX)) % (canvas.height * bgHeightToWidth));
        }
        this.plane.update(canvas, this.dead);
        if (!this.dead) {
            let n = 0;
            this.pillars = this.pillars.filter((pillar: Pillar) => {
                pillar.update();
                if (pillar.x > 0) {
                    return true;
                } else {
                    n++;
                    return false;
                }
            });
            for (let i = 0; i < n; i++) {
                this.pillars.push(
                    new Pillar(
                        canvas.width + 10,
                        randomBetween(canvas.height / 6, canvas.height * 5 / 6)
                    )
                )
            }
            this.pillars.forEach((pillar: Pillar) => {
                if (CheckCollision(canvas, this.plane, pillar)) {
                    this.explode();
                }
            });
            this.pillars.forEach((pillar: Pillar) => {
                if (!pillar.marked && between(canvas, this.plane, pillar)) {
                    this.updateScore();
                    pillar.marked = true;
                }
            })
        }
    }
    explode() {
        if (this.dead) return;
        this.dead = true;
        let count = 0;
        const interval = setInterval(() => {
            this.planeImg = this.explosionImgs[count];
            count++;
            if (count > 4) {
                this.end();
                this.planeImg.src = "";
                clearInterval(interval);
            }
        }, 100);
    }
    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const bgWidth = canvas.height * bgHeightToWidth;
        context.drawImage(this.backgroundImg, this.currX, 0, bgWidth, canvas.height);
        context.drawImage(this.backgroundImg, this.currX + bgWidth, 0, bgWidth, canvas.height);
        this.pillars.map(p => p.draw(canvas, context, this.pillarImg));
        this.plane.draw(canvas, context, this.planeImg);
    }
}

function CheckCollision(canvas: HTMLCanvasElement, plane: Plane, pillar: Pillar): boolean {
    if (plane.x > pillar.x - PILLAR_WIDTH / 2 && plane.x < pillar.x + PILLAR_WIDTH / 2) {
        let y = canvas.height / 2 + plane.y;
        if (y > canvas.height - pillar.height || y < canvas.height - (pillar.height + PILLAR_GAP)) {
            return true;
        }
    }
    return false;
}   
function between(canvas: HTMLCanvasElement, plane: Plane, pillar: Pillar): boolean {
    if (plane.x > pillar.x - PILLAR_WIDTH / 2 && plane.x < pillar.x + PILLAR_WIDTH / 2) {
        let y = canvas.height / 2 + plane.y;
        if (y > canvas.height - pillar.height || y < canvas.height - (pillar.height + PILLAR_GAP)) {
            return false;
        } else {
            return true;
        }
    }
    return false;
}