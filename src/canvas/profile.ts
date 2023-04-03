import Canvas, { GlobalFonts } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";
import { join } from "path";

export async function profileCanvas(
  backgroundUrl: string,
  avatarUrl: string,
  username: string,
  xp: number,
  neededXp: number,
  level: number,
  rank: number
) {
  const canvas = Canvas.createCanvas(900, 250);
  const ctx = canvas.getContext("2d");
  GlobalFonts.registerFromPath(
    join(__dirname, "..", "canvas/fonts", "DeliciousHandrawn-Regular.ttf"),
    "Handdrawn"
  );

  console.log(GlobalFonts.families);
  //#region Loading Images
  const background = await Canvas.loadImage(backgroundUrl);
  const avatar = await Canvas.loadImage(avatarUrl);
  //#endregion

  //#region Background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  //#endregion

  //#region Shadow Box
  ctx.fillStyle = "rgba(53, 48, 46, 0.40)";
  ctx.fillRect(10, 10, 880, 230);
  //#endregion

  //#region Progress Bar
  ctx.fillStyle = "rgba(31, 28, 27, 0.87)";
  ctx.fillRect(220, 200, 650, 30);

  ctx.fillStyle = "hsl(155, 67%, 51%)";
  ctx.fillRect(222, 201, Math.floor(xp * 6.5), 28);

  ctx.font = "28px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${xp}/${neededXp}`, 500, 223);
  //#endregion

  //#region Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "28px Arial";
  ctx.fillText(`Level ${level}`, 230, 170);

  ctx.font = "28px Arial";
  ctx.fillText(`${username}`, 230, 120);

  ctx.font = "24px Arial";
  ctx.fillText(`Rank #${rank}`, 750, 120);
  //#endregion

  //#region Line
  ctx.beginPath();
  ctx.moveTo(230, 135);
  ctx.lineTo(850, 135);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.closePath();
  //#endregion

  //#region Avatar
  ctx.strokeStyle = "hsl(155, 67%, 51%)";
  ctx.lineWidth = 10;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(120, 120, 100, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, 20, 20, 200, 200);
  //#endregion
  const attachment = new AttachmentBuilder(await canvas.toBuffer("image/png"), {
    name: `${username.split("#")[0]}-profile.png`,
  });

  return attachment;
}
