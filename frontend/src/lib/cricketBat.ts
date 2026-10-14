import { CricketBatState } from '../types/game';

/**
 * Procedural High-Definition Cricket Bat Renderer for AR Gameplay
 * Renders an authentic English willow cricket bat with dynamic rubber grip,
 * metallic embossed branding stickers, wood grain, sweet-spot bracket guides,
 * and high-speed swing motion trails.
 */

export function drawCricketBat(
  ctx: CanvasRenderingContext2D,
  bat: CricketBatState,
  timestamp: number
) {
  if (!bat.isDetected) return;

  const { gripX, gripY, angle, batLength, batWidth, swingSpeed, lastHitTime } = bat;
  const isRecentlyHit = timestamp - lastHitTime < 240;
  const hitProgress = Math.min(1, (timestamp - lastHitTime) / 240);

  ctx.save();
  ctx.translate(gripX, gripY);
  ctx.rotate(angle);

  const L = batLength;
  const W = batWidth;
  const handleL = L * 0.28;
  const bladeL = L * 0.72;
  const handleW = Math.max(16, W * 0.32);

  // 1. Draw High-Speed Swing Motion Trail (Golden energy arc)
  if (swingSpeed > 200 || isRecentlyHit) {
    ctx.save();
    const trailAlpha = isRecentlyHit ? (1 - hitProgress) * 0.45 : Math.min(0.35, (swingSpeed - 200) / 800);
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 16;
    ctx.fillStyle = `rgba(245, 158, 11, ${trailAlpha})`;
    ctx.beginPath();
    ctx.moveTo(-W * 0.7, -handleL);
    ctx.lineTo(-W * 1.1, -L);
    ctx.lineTo(W * 1.1, -L);
    ctx.lineTo(W * 0.7, -handleL);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Realistic Depth Drop Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;

  // 3. Draw Blade Outline & English Willow Wood Base
  ctx.beginPath();
  // Handle-to-blade shoulder start
  ctx.moveTo(-handleW * 0.5, -handleL);
  // Left shoulder curve
  ctx.bezierCurveTo(
    -handleW * 0.6, -handleL - bladeL * 0.04,
    -W * 0.48, -handleL - bladeL * 0.08,
    -W * 0.5, -handleL - bladeL * 0.14
  );
  // Left blade edge
  ctx.lineTo(-W * 0.49, -L + 12);
  // Curved toe (bottom tip of cricket bat)
  ctx.quadraticCurveTo(-W * 0.46, -L, 0, -L);
  ctx.quadraticCurveTo(W * 0.46, -L, W * 0.49, -L + 12);
  // Right blade edge
  ctx.lineTo(W * 0.5, -handleL - bladeL * 0.14);
  // Right shoulder curve
  ctx.bezierCurveTo(
    W * 0.48, -handleL - bladeL * 0.08,
    handleW * 0.6, -handleL - bladeL * 0.04,
    handleW * 0.5, -handleL
  );
  ctx.closePath();

  // Willow Wood 3D Convex Face Gradient
  const woodGrad = ctx.createLinearGradient(-W * 0.5, 0, W * 0.5, 0);
  woodGrad.addColorStop(0.0, '#C99E5C'); // Left edge shadow
  woodGrad.addColorStop(0.12, '#E0BA7D');
  woodGrad.addColorStop(0.48, '#FFF1D6'); // Spine highlight (sweet spot ridge)
  woodGrad.addColorStop(0.52, '#FDE8C0');
  woodGrad.addColorStop(0.88, '#DFB97B');
  woodGrad.addColorStop(1.0, '#B38343'); // Right edge shadow

  ctx.fillStyle = woodGrad;
  ctx.fill();

  // Reset shadow for fine inner details
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 4. Subtle Willow Wood Grain Streaks
  ctx.save();
  ctx.clip(); // Clip to bat blade shape
  ctx.strokeStyle = 'rgba(160, 110, 50, 0.18)';
  ctx.lineWidth = 1;
  const grainOffsets = [-W * 0.35, -W * 0.22, -W * 0.08, W * 0.08, W * 0.22, W * 0.35];
  for (const gx of grainOffsets) {
    ctx.beginPath();
    ctx.moveTo(gx, -handleL);
    ctx.bezierCurveTo(gx - 2, -handleL - bladeL * 0.4, gx + 2, -handleL - bladeL * 0.7, gx, -L);
    ctx.stroke();
  }

  // 5. Traditional Cane Handle V-Splice Triangle
  ctx.beginPath();
  ctx.moveTo(0, -handleL - bladeL * 0.22);
  ctx.lineTo(-handleW * 0.4, -handleL);
  ctx.lineTo(handleW * 0.4, -handleL);
  ctx.closePath();
  ctx.fillStyle = 'rgba(92, 58, 24, 0.4)';
  ctx.fill();

  // 6. Protective Bat Toe Guard (Rubber coating at bottom)
  const toeGrad = ctx.createLinearGradient(0, -L + 18, 0, -L);
  toeGrad.addColorStop(0, '#1E293B');
  toeGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = toeGrad;
  ctx.fillRect(-W * 0.5, -L, W, 14);

  // Red accent toe pin-stripe
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(-W * 0.5, -L + 14, W, 2.5);

  // 7. Premium Brand Sticker ("SAMPATH BAT" & "POWER WONDER")
  const stickerW = W * 0.78;
  const stickerH = bladeL * 0.38;
  const stickerY = -handleL - bladeL * 0.26 - stickerH * 0.5;

  // Sticker background plate (Glossy midnight navy)
  const plateGrad = ctx.createLinearGradient(0, stickerY, 0, stickerY + stickerH);
  plateGrad.addColorStop(0, '#0F172A');
  plateGrad.addColorStop(0.5, '#1E293B');
  plateGrad.addColorStop(1, '#020617');

  ctx.fillStyle = plateGrad;
  ctx.beginPath();
  ctx.roundRect(-stickerW * 0.5, stickerY, stickerW, stickerH, 8);
  ctx.fill();

  // Gold foil border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Metallic Gold Inner Border
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-stickerW * 0.5 + 3, stickerY + 3, stickerW - 6, stickerH - 6, 6);
  ctx.stroke();

  // Brand Name Typography ("SAMPATH BAT")
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Sub-header
  ctx.font = '900 8px system-ui, sans-serif';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('ELEPHANT HOUSE', 0, stickerY + stickerH * 0.22);

  // Main Brand Name
  ctx.font = '900 13px system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText('SAMPATH', 0, stickerY + stickerH * 0.5);

  // Badge bottom pill
  ctx.font = '900 8px system-ui, sans-serif';
  ctx.fillStyle = '#F43F5E';
  ctx.fillText('★ CRICKET BAT ★', 0, stickerY + stickerH * 0.76);
  ctx.restore();

  // Dynamic Holographic Foil Sheen (Sweeps across sticker periodically)
  const sheenPos = ((timestamp * 0.0008) % 1.0) * (stickerW * 2) - stickerW;
  const sheenGrad = ctx.createLinearGradient(sheenPos - 20, stickerY, sheenPos + 20, stickerY + stickerH);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad;
  ctx.fill();

  // 8. Sweet Spot Target Zone Brackets (Target guide for players)
  const sweetSpotY = -handleL - bladeL * 0.65;
  const sweetSpotH = bladeL * 0.26;
  const pulse = Math.sin(timestamp * 0.008) * 0.2 + 0.8;

  ctx.strokeStyle = `rgba(245, 158, 11, ${0.45 * pulse})`;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);

  // Left Bracket
  ctx.beginPath();
  ctx.moveTo(-W * 0.44 + 6, sweetSpotY - sweetSpotH * 0.5);
  ctx.lineTo(-W * 0.44, sweetSpotY - sweetSpotH * 0.5);
  ctx.lineTo(-W * 0.44, sweetSpotY + sweetSpotH * 0.5);
  ctx.lineTo(-W * 0.44 + 6, sweetSpotY + sweetSpotH * 0.5);
  ctx.stroke();

  // Right Bracket
  ctx.beginPath();
  ctx.moveTo(W * 0.44 - 6, sweetSpotY - sweetSpotH * 0.5);
  ctx.lineTo(W * 0.44, sweetSpotY - sweetSpotH * 0.5);
  ctx.lineTo(W * 0.44, sweetSpotY + sweetSpotH * 0.5);
  ctx.lineTo(W * 0.44 - 6, sweetSpotY + sweetSpotH * 0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sweet Spot Center Star
  ctx.fillStyle = `rgba(245, 158, 11, ${0.7 * pulse})`;
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ SWEET SPOT', 0, sweetSpotY);

  // End blade clipping
  ctx.restore();

  // 9. Draw Blade Border Outline
  ctx.strokeStyle = 'rgba(100, 65, 25, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 10. Draw Rubber Wrapped Handle (Grip)
  // Handle body
  const gripGrad = ctx.createLinearGradient(-handleW * 0.5, 0, handleW * 0.5, 0);
  gripGrad.addColorStop(0, '#1E3A8A'); // Deep Royal Navy
  gripGrad.addColorStop(0.35, '#3B82F6'); // Bright Cobalt Blue Highlight
  gripGrad.addColorStop(0.7, '#2563EB');
  gripGrad.addColorStop(1, '#172554');

  ctx.fillStyle = gripGrad;
  ctx.beginPath();
  ctx.roundRect(-handleW * 0.5, -handleL, handleW, handleL, [0, 0, 4, 4]);
  ctx.fill();

  // Rubber Spiral Grip Ridges Texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 2;
  const numRings = 14;
  for (let i = 1; i < numRings; i++) {
    const ry = -handleL + (handleL / numRings) * i;
    ctx.beginPath();
    ctx.moveTo(-handleW * 0.5, ry - 3);
    ctx.lineTo(handleW * 0.5, ry + 3);
    ctx.stroke();
  }

  // Handle Knob / Cap at Base
  const knobGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, handleW * 0.65);
  knobGrad.addColorStop(0, '#FFFFFF');
  knobGrad.addColorStop(0.5, '#E2E8F0');
  knobGrad.addColorStop(1, '#64748B');

  ctx.fillStyle = knobGrad;
  ctx.beginPath();
  ctx.arc(0, 0, handleW * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 11. Catch Impact Burst Shockwave (When popsicle is caught!)
  if (isRecentlyHit) {
    const shockRadius = 30 + (1 - hitProgress) * 60;
    const shockAlpha = (1 - hitProgress) * 0.8;
    ctx.strokeStyle = `rgba(255, 215, 0, ${shockAlpha})`;
    ctx.lineWidth = 4 * (1 - hitProgress);
    ctx.beginPath();
    ctx.arc(0, sweetSpotY, shockRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Golden impact sparks
    ctx.fillStyle = `rgba(255, 255, 255, ${shockAlpha})`;
    for (let s = 0; s < 6; s++) {
      const sAngle = (s / 6) * Math.PI * 2 + hitProgress * 2;
      const sDist = shockRadius * 0.85;
      ctx.beginPath();
      ctx.arc(Math.cos(sAngle) * sDist, sweetSpotY + Math.sin(sAngle) * sDist, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Renders an AR Batting Stance Guide Crosshair when camera is searching for player / bat
 */
export function drawBatCrosshair(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const cx = width * 0.5;
  const cy = height * 0.62;
  const guideW = Math.min(width * 0.6, 260);
  const guideH = guideW * 0.75;

  ctx.save();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  // Batting Stance Box
  ctx.beginPath();
  ctx.roundRect(cx - guideW * 0.5, cy - guideH * 0.5, guideW, guideH, 20);
  ctx.stroke();
  ctx.setLineDash([]);

  // Corner brackets
  const cornerSize = 18;
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(cx - guideW * 0.5, cy - guideH * 0.5 + cornerSize);
  ctx.lineTo(cx - guideW * 0.5, cy - guideH * 0.5);
  ctx.lineTo(cx - guideW * 0.5 + cornerSize, cy - guideH * 0.5);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(cx + guideW * 0.5 - cornerSize, cy - guideH * 0.5);
  ctx.lineTo(cx + guideW * 0.5, cy - guideH * 0.5);
  ctx.lineTo(cx + guideW * 0.5, cy - guideH * 0.5 + cornerSize);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(cx - guideW * 0.5, cy + guideH * 0.5 - cornerSize);
  ctx.lineTo(cx - guideW * 0.5, cy + guideH * 0.5);
  ctx.lineTo(cx - guideW * 0.5 + cornerSize, cy + guideH * 0.5);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(cx + guideW * 0.5 - cornerSize, cy + guideH * 0.5);
  ctx.lineTo(cx + guideW * 0.5, cy + guideH * 0.5);
  ctx.lineTo(cx + guideW * 0.5, cy + guideH * 0.5 - cornerSize);
  ctx.stroke();

  // Mini Bat Icon in center of guide
  ctx.font = '28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏏', cx, cy - 8);

  ctx.font = '700 12px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('Hold Bat or Raise Hands Here', cx, cy + 22);

  ctx.restore();
}
