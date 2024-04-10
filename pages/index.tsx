import Game, { bgHeightToWidth } from '@/components/game';
import { useEffect, useRef, useState } from 'react';

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
let game: Game;
let ran = 0;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  useEffect(() => {
    if (ran == 1) return;
    ran++;
    canvas = document.getElementById('game') as HTMLCanvasElement;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    context = canvas.getContext('2d')!;
    const img = document.createElement("img");
    img.src = "/background.jpg";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.height * bgHeightToWidth, canvas.height);
    gameLoop();
    document.addEventListener("click", handleClick);

  }, []);
  const handleClick = () => {
    if (game && !game.dead) {
      const pop = new Audio("/pop.mp3");
      pop.play();
      game?.plane?.jump();
    }
  }
  const gameLoop = () => {
    game?.update(canvas);
    game?.draw(canvas, context);
    requestAnimationFrame(gameLoop);
  };
  const play = () => {
    setIsPlaying(true);
    setScore(0);
    game = new Game(canvas, end, () => {
      setScore(score => score + 1);
    });
  }
  const end = () => {
    setIsPlaying(false);
    setHasPlayed(true);
    const allahu_akbar = new Audio("/allahu_akbar.mp3");
    allahu_akbar.play();
  }

  return (
    <div className="w-screen h-screen text-white" style={{backgroundImage: `url("/camo.webp")`}}>
      <div className="flex flex-row justify-center items-center">
        <img src="/911.gif" alt="911 GIF" />
        <img src="/osema_banner_2.png" alt="Osema Banner" />
        <img src="/911.gif" alt="911 GIF" />
      </div>
      <p className="text-center font-extrabold text-4xl">Buy $OSEMA for a safe flight!</p>
      <div className="flex justify-center items-center w-full">
        <div className="w-auto h-auto relative">
          <canvas id="game" className="border border-black" />
          {isPlaying &&
          <div className="absolute flex justify-center items-center top-0 left-0 w-full mt-8">
            <p className=" align-center text-center font-extrabold text-3xl p-4 bg-red-600 rounded-lg text-black">{score}</p>
          </div>
        }
        {!isPlaying && !hasPlayed &&
        <>
          <button onClick={play} className="absolute font-extrabold text-2xl  bg-blue-400 px-8 py-2 rounded z-10 bg-cover" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/murica_waving.gif")`}}>
            Play
          </button>
          <div className="absolute w-full h-full top-0 left-0 bg-cover" style={{backgroundImage: `url("/background.png")`}}></div>
          </>
        }
        {!isPlaying && hasPlayed &&
          <div className="absolute flex flex-col justify-center items-center gap-10" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <div className="w-[300px] h-52 rounded-lg flex flex-col justify-center items-center bg-cover" style={{backgroundImage: `url("/murica_waving.gif")`}}>
                <p className='font-extrabold text-xl'>You scored: {score} </p>
            </div>
            <button onClick={play} className="w-32 text-center h-16 bg-white rounded-lg font-extrabold text-4xl text-black hover:brightness-90 active:brightness-75 hover:cursor-pointer">
              {`\u25B6`}
            </button>
          </div>
        }
      </div>
      </div>

    </div>
  );
}