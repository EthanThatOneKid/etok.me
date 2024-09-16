import {
  BODY,
  DIV,
  HEAD,
  HTML,
  META,
  SECTION,
  STYLE,
  TITLE,
} from "@fartlabs/htx";

if (import.meta.main) {
  Deno.writeTextFileSync(
    "./index.html",
    <LavaLampDudeDocument />,
  );
  Deno.serve(() =>
    new Response(
      <LavaLampDudeDocument />,
      {
        headers: { "content-type": "text/html" },
      },
    )
  );
}

function Document() {
  return "<!DOCTYPE html>" + (
    <HTML lang="en">
      <HEAD>
        <TITLE>Ethan Davidson</TITLE>
        <META charset="UTF-8" />
        <META name="viewport" content="width=device-width, initial-scale=1.0" />
        <STYLE>{Deno.readTextFileSync("./index.css")}</STYLE>
      </HEAD>
      <BODY>
        <LavaLampDude />
      </BODY>
    </HTML>
  );
}

/**
 * LavaLampDude is a component that renders a lava lamp dude.
 *
 * Inspiration:
 * - https://adventuretime.fandom.com/wiki/Flame_People#Official_art
 * - https://codepen.io/animationbro/pen/LYerZLw
 */
function LavaLampDude() {
  return (
    <SECTION>
      <DIV class="blob">{generateSVG()}</DIV>
    </SECTION>
  );
}

function generateSVG() {
  return `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color: rgb(255, 95, 109)"></stop>
      <stop offset="100%" style="stop-color: rgb(255, 195, 113)"></stop>
    </linearGradient>
    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color: rgb(255, 195, 113)"></stop>
      <stop offset="100%" style="stop-color: rgb(255, 95, 109)"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#gradient)">
    <animate attributeName="d" dur="32000ms" repeatCount="indefinite" values="M451.5,299Q420,348,383.5,383Q347,418,298.5,441.5Q250,465,198,447.5Q146,430,111,390Q76,350,44.5,300Q13,250,47.5,201.5Q82,153,111.5,107.5Q141,62,195.5,57Q250,52,297,69.5Q344,87,392.5,113.5Q441,140,462,195Q483,250,451.5,299Z;
    M455.5,306Q444,362,400,398Q356,434,303,456.5Q250,479,202,448Q154,417,104,390Q54,363,48.5,306.5Q43,250,52,195.5Q61,141,99.5,98.5Q138,56,194,59.5Q250,63,308,56.5Q366,50,394.5,100Q423,150,445,200Q467,250,455.5,306Z;
    M471,306.5Q445,363,401.5,400Q358,437,304,452.5Q250,468,203,440.
    5Q156,413,100.5,391Q45,369,52.5,309.5Q60,250,73.5,203Q87,156,123,124.5Q159,93,204.5,55.5Q250,18,311,28Q372,38,415,84Q458,130,477.5,190Q497,250,471,306.5Z;
    M438,300Q422,350,385.5,386Q349,422,299.5,451Q250,480,193.5,462.5Q137,445,104,399Q71,353,39,301.5Q7,250,37.5,197.5Q68,145,97,89.5Q126,34,188,18.5Q250,3,300,40Q350,77,389,112Q428,147,441,198.5Q454,250,438,300Z;
    M459.5,309.5Q456,369,402,394.5Q348,420,299,459Q250,498,198.5,463.5Q147,429,94.5,399.5Q42,370,40,310Q38,250,62.5,203Q87,156,119,117.5Q151,79,200.5,53.5Q250,28,312,31.5Q374,35,394.5,95Q415,155,439,202.5Q463,250,459.5,309.5Z;
    M451.5,299Q420,348,383.5,383Q347,418,298.5,441.5Q250,465,198,447.5Q146,430,111,390Q76,350,44.5,300Q13,250,47.5,201.5Q82,153,111.5,107.5Q141,62,195.5,57Q250,52,297,69.5Q344,87,392.5,113.5Q441,140,462,195Q483,250,451.5,299Z"></animate>
  </path>
  <circle cx="165" cy="225" r="10" fill="black" />
  <circle cx="330" cy="225" r="10" fill="black" />
  <path d="M 175 300 Q 250 350 325 300" stroke="black" stroke-width="10" fill="none" stroke-linecap="round" />
  ${<Arm x={100} y={300} width={100} height={200} />}
  <path d="M 400 300 Q 450 150 500 300" fill="url(#gradient2)" stroke-linecap="round" />
  <path d="M 175 450 Q 200 500 225 450" stroke="black" stroke-width="10" fill="none" stroke-linecap="round" />
  <path d="M 275 450 Q 300 500 325 450" stroke="black" stroke-width="10" fill="none" stroke-linecap="round" />
</svg>`;
}

interface ArmProps {
  x: number;
  y: number;
  width: number;
  height: number;

  /**
   * radians rotates the arm from the shoulder.
   */
  // radians: number;
}

function Arm({ x, y, width, height }: ArmProps) {
  return `<path d="M ${x} ${y} Q ${x + width / 2} ${y + height} ${
    x + width
  } ${y}" fill="url(#gradient2)" stroke-linecap="round" />`;
}
