/**
 * Share Card Generator
 * Generates shareable achievement card images using Canvas API
 * Matches the celebration modal style with decorative border and branding
 */

import { AchievementDisplay } from '@/types/achievements';
import { APP_CONFIG } from '@/config/app';

// Card dimensions - single square format for simplicity
const CARD_SIZE = 1080;

// Colors matching the celebration modal
const COLORS = {
  primary: '#00B2A9',      // Teal
  secondary: '#FFD966',    // Gold
  accent: '#FF6F61',       // Coral
  background: '#FFFFFF',   // White
  text: '#333333',         // Dark gray
  lightGray: '#F6F8FB',    // Light gray
};

// Badge emoji mapping
const BADGE_EMOJIS: Record<string, string> = {
  '1': '1️⃣',
  'flame': '🔥',
  'trophy': '🏆',
  'brain': '🧠',
  'perfect': '💯',
  'belt': '🥋',
  'bolt': '⚡',
  'calculator': '🧮',
  'star': '⭐',
  'medal': '🏅',
  'crown': '👑',
  'rocket': '🚀',
};

export interface SimpleShareCardConfig {
  achievement: AchievementDisplay;
  childAvatar: string;
}

/**
 * Generate a share card blob - simplified version matching celebration modal
 */
export async function generateShareCardBlob(config: SimpleShareCardConfig): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;

  // Draw everything
  drawBackground(ctx);
  drawDecorations(ctx);
  drawDecoativeBorder(ctx);
  drawAvatar(ctx, config.childAvatar);
  drawBadge(ctx, config.achievement.icon);
  drawTitle(ctx, config.achievement.title);
  drawDescription(ctx, config.achievement.description);

  if (config.achievement.quote) {
    drawQuote(ctx, config.achievement.quote);
  }

  drawBranding(ctx);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image'));
      }
    }, 'image/png', 1.0);
  });
}

/**
 * Draw white background with subtle gradient
 */
function drawBackground(ctx: CanvasRenderingContext2D) {
  // White base
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // Add subtle gradient overlay (matching modal animation)
  const gradient = ctx.createLinearGradient(0, 0, CARD_SIZE, CARD_SIZE);
  gradient.addColorStop(0, 'rgba(0, 178, 169, 0.08)');  // Teal
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(255, 111, 97, 0.08)');  // Coral

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
}

/**
 * Draw decorative elements (matching modal)
 */
function drawDecorations(ctx: CanvasRenderingContext2D) {
  ctx.save();

  // Top left decorative circle
  ctx.beginPath();
  ctx.arc(-100, -100, 300, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 178, 169, 0.1)';
  ctx.fill();

  // Bottom right decorative circle
  ctx.beginPath();
  ctx.arc(CARD_SIZE + 100, CARD_SIZE + 100, 300, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 217, 102, 0.1)';
  ctx.fill();

  // Small accent circles
  ctx.beginPath();
  ctx.arc(CARD_SIZE - 150, 200, 100, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 111, 97, 0.08)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(150, CARD_SIZE - 200, 80, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 178, 169, 0.08)';
  ctx.fill();

  ctx.restore();
}

/**
 * Draw decorative border (teal with gold accent corners)
 */
function drawDecoativeBorder(ctx: CanvasRenderingContext2D) {
  const borderWidth = 12;
  const inset = 30;
  const cornerRadius = 40;
  const cornerLength = 80;

  ctx.save();

  // Main teal border
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';

  // Draw rounded rectangle border
  const x = inset;
  const y = inset;
  const w = CARD_SIZE - (inset * 2);
  const h = CARD_SIZE - (inset * 2);

  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + w - cornerRadius, y);
  ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius);
  ctx.lineTo(x + w, y + h - cornerRadius);
  ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius);
  ctx.lineTo(x + cornerRadius, y + h);
  ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
  ctx.closePath();
  ctx.stroke();

  // Gold accent on corners
  ctx.strokeStyle = COLORS.secondary;
  ctx.lineWidth = borderWidth + 2;

  // Top-left corner accent
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + cornerRadius + cornerLength, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + cornerRadius);
  ctx.lineTo(x, y + cornerRadius + cornerLength);
  ctx.stroke();

  // Top-right corner accent
  ctx.beginPath();
  ctx.moveTo(x + w - cornerRadius - cornerLength, y);
  ctx.lineTo(x + w - cornerRadius, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w, y + cornerRadius);
  ctx.lineTo(x + w, y + cornerRadius + cornerLength);
  ctx.stroke();

  // Bottom-left corner accent
  ctx.beginPath();
  ctx.moveTo(x, y + h - cornerRadius - cornerLength);
  ctx.lineTo(x, y + h - cornerRadius);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y + h);
  ctx.lineTo(x + cornerRadius + cornerLength, y + h);
  ctx.stroke();

  // Bottom-right corner accent
  ctx.beginPath();
  ctx.moveTo(x + w, y + h - cornerRadius - cornerLength);
  ctx.lineTo(x + w, y + h - cornerRadius);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w - cornerRadius - cornerLength, y + h);
  ctx.lineTo(x + w - cornerRadius, y + h);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw child's avatar emoji
 */
function drawAvatar(ctx: CanvasRenderingContext2D, avatar: string) {
  const centerX = CARD_SIZE / 2;
  const avatarY = 280;
  const avatarRadius = 80;

  // White circle background with shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  ctx.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.restore();

  // Border
  ctx.beginPath();
  ctx.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Avatar emoji
  ctx.font = '80px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.text;
  ctx.fillText(avatar, centerX, avatarY + 5);
}

/**
 * Draw achievement badge with glow
 */
function drawBadge(ctx: CanvasRenderingContext2D, icon: string) {
  const centerX = CARD_SIZE / 2;
  const badgeY = 450;
  const badgeRadius = 65;

  ctx.save();

  // Glow effect
  ctx.shadowColor = COLORS.primary;
  ctx.shadowBlur = 30;

  // Badge circle with gradient
  const gradient = ctx.createRadialGradient(
    centerX - 15, badgeY - 15, 0,
    centerX, badgeY, badgeRadius
  );
  gradient.addColorStop(0, COLORS.primary);
  gradient.addColorStop(1, adjustColor(COLORS.primary, -20));

  ctx.beginPath();
  ctx.arc(centerX, badgeY, badgeRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();

  // Inner highlight ring
  ctx.beginPath();
  ctx.arc(centerX, badgeY, badgeRadius - 8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Badge emoji
  const emoji = BADGE_EMOJIS[icon] || '⭐';
  ctx.font = '60px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, centerX, badgeY + 4);
}

/**
 * Draw achievement title
 */
function drawTitle(ctx: CanvasRenderingContext2D, title: string) {
  const centerX = CARD_SIZE / 2;
  const titleY = 580;

  ctx.font = 'bold 56px Verdana, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.text;

  // Word wrap if needed
  const maxWidth = CARD_SIZE - 160;
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  const lineHeight = 70;
  const startY = titleY - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
}

/**
 * Draw achievement description
 */
function drawDescription(ctx: CanvasRenderingContext2D, description: string) {
  const centerX = CARD_SIZE / 2;
  const descY = 680;

  ctx.font = '32px Verdana, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(51, 51, 51, 0.75)';

  // Word wrap
  const maxWidth = CARD_SIZE - 180;
  const words = description.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  const lineHeight = 45;
  const startY = descY - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
}

/**
 * Draw motivational quote
 */
function drawQuote(ctx: CanvasRenderingContext2D, quote: string) {
  const centerX = CARD_SIZE / 2;
  const quoteY = 800;

  ctx.save();
  ctx.font = 'italic 26px Verdana, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.primary;

  ctx.fillText(`"${quote}"`, centerX, quoteY);
  ctx.restore();
}

/**
 * Draw MindFoundry branding with URL
 */
function drawBranding(ctx: CanvasRenderingContext2D) {
  const centerX = CARD_SIZE / 2;
  const brandingY = CARD_SIZE - 100;

  ctx.save();

  // Divider line
  ctx.strokeStyle = 'rgba(0, 178, 169, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, brandingY - 40);
  ctx.lineTo(CARD_SIZE - 200, brandingY - 40);
  ctx.stroke();

  // Brand emoji and name
  ctx.font = '28px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(APP_CONFIG.brandEmoji, centerX - 100, brandingY);

  ctx.font = 'bold 28px Verdana, Arial, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.fillText(APP_CONFIG.appName, centerX + 10, brandingY);

  // URL below
  ctx.font = '22px Verdana, Arial, sans-serif';
  ctx.fillStyle = COLORS.primary;
  ctx.fillText(APP_CONFIG.appUrl, centerX, brandingY + 40);

  ctx.restore();
}

/**
 * Adjust color brightness
 */
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default {
  generateShareCardBlob,
};
