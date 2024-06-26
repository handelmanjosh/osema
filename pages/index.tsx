import BasicLink from '@/components/BasicLink';
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
  const [small, setSmall] = useState<boolean>(false);
  useEffect(() => {

    canvas = document.getElementById('game') as HTMLCanvasElement;
    if (window.outerWidth < 600) {
      canvas.width = CANVAS_WIDTH / 2;
      canvas.height = CANVAS_WIDTH / 2;
      console.log(canvas.width, canvas.height);
      setSmall(true);
    } else {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      setSmall(false);
    }
    context = canvas.getContext('2d')!;
    const img = document.createElement("img");
    img.src = "/background.jpg";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.height * bgHeightToWidth, canvas.height);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, []);
  useEffect(() => {
    if (ran == 1) return;
    ran++;
    gameLoop();
  }, [])
  const handleClick = () => {
    if (game && !game.dead) {
      const pop = new Audio("/pop.mp3");
      pop.play();
      game?.plane?.jump();
    }
  }
  const gameLoop = () => {
    console.log(canvas.width, canvas.height);
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
    <div className="w-screen h-auto min-h-screen text-white" style={{backgroundImage: `url("/camo.webp")`}}>
      <div className="flex flex-row justify-center items-center">
        {!small && <img src="/911.gif" alt="911 GIF" />}
        <img src="/osema_banner_2.png" alt="Osema Banner" />
        {!small && <img src="/911.gif" alt="911 GIF" />}
      </div>
      <p className="text-center font-extrabold text-xl md:text-2xl lg:text-4xl">Plez buy $OSEMA Allehu Ackbor</p>
      {small ? 
        <div className="flex flex-col justify-center items-center gap-2">
            <BasicLink text="Twitter" to="https://twitter.com/BenLodenSolana" />
          <div className="flex flex-row justify-center items-center gap-2">
            <BasicLink text="Chart" to="https://pump.fun/6iYBTV3ZpC8wuK9nVauNRR2AmqV7jAzaDr54HfacAPow" />
            <BasicLink text="Telegram" to="https://t.me/+atpmkA_e-FY3YWRh" />
          </div>
        </div>
        :
        <div className="flex flex-row justify-center items-center md:gap-2 lg:gap-4 my-2">
          <BasicLink text="Twitter" to="https://twitter.com/BenLodenSolana" />
          <BasicLink text="Chart" to="chart" />
          <BasicLink text="Telegram" to="https://t.me/+atpmkA_e-FY3YWRh" />
        </div>
      }
      <div className="flex justify-center items-center w-full">
        <div className="w-auto h-auto relative my-10">
          <canvas id="game" className="border border-black" />
          {isPlaying &&
          <div className="absolute flex justify-center items-center top-0 left-0 w-full mt-2 md:mt-6 lg:mt-8">
            <p className=" align-center text-center font-extrabold text-lg md:text-xl lg:text-3xl p-4 bg-red-600 rounded-lg text-black">{score}</p>
          </div>
        }
        {!isPlaying && !hasPlayed &&
        <>
          <button onClick={play} className="absolute font-extrabold text-base md:text-lg lg:text-2xl  bg-blue-400 px-8 py-2 rounded z-10 bg-cover" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/murica_waving.gif")`}}>
            Play
          </button>
          <div className="absolute w-full h-full top-0 left-0 bg-cover" style={{backgroundImage: `url("/background.png")`}}></div>
          </>
        }
        {!isPlaying && hasPlayed &&
          <div className="absolute flex flex-col justify-center items-center gap-10" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <div className="w-[200px] md:w-[300px] h-36 md:h-44 lg:h-52 rounded-lg flex flex-col justify-center items-center bg-cover" style={{backgroundImage: `url("/murica_waving.gif")`}}>
                <p className='font-extrabold text-sm md:text-lg lg:text-xl'>You scored: {score} </p>
            </div>
            <button onClick={play} className="text-center bg-white rounded-lg p-4 font-extrabold text-sm md:text-base lg:text-lg text-black hover:brightness-90 active:brightness-75 hover:cursor-pointer">
              {`Play again`}
            </button>
          </div>
        }
      </div>
      </div>

    </div>
  );
}