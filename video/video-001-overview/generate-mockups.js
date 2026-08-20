#!/usr/bin/env node
/**
 * MindFoundry Video-001 - App UI Mockup Image Generator
 * Generates stylized app screenshots via Nano Banana Pro
 * These serve as placeholders until real screenshots are captured
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'assets/screenshots');

const mockupPrompts = [
  {
    filename: 'mockup-01-study-page.png',
    prompt: 'A clean modern mobile app screenshot mockup showing a childrens math practice app. The screen displays a white worksheet with 3 simple addition math problems arranged vertically with empty answer input boxes next to each. At the bottom is a colorful number pad with buttons 0-9 in teal color. The top bar shows "Level 3A - Addition" in orange text. Clean UI design, flat design, modern mobile app mockup, light background. 16:9 aspect ratio showing the phone screen centered on a clean background.'
  },
  {
    filename: 'mockup-02-ms-guide-hint.png',
    prompt: 'A clean modern mobile app screenshot mockup showing an AI tutor chat feature in a math app for children. A friendly cartoon owl or robot character avatar appears on the right side with a speech bubble saying a helpful math hint. The background shows a math problem "7 + 5 = ?" with a wrong answer crossed out. The AI tutor character has warm teal and orange colors. Clean modern UI design, flat illustration style, child-friendly colors. 16:9 aspect ratio.'
  },
  {
    filename: 'mockup-03-celebration.png',
    prompt: 'A vibrant celebratory mobile app screen showing a math achievement celebration. Colorful confetti particles fill the screen. A central card shows "100 Day Streak!" with a gold medal badge icon and a childs emoji avatar. The card has teal borders and decorative gold corners. A "Share" button in orange color appears below the card. Purple and teal gradient background with sparkle effects. Modern flat UI design, joyful atmosphere. 16:9 aspect ratio.'
  },
  {
    filename: 'mockup-04-parent-dashboard.png',
    prompt: 'A clean modern dashboard interface showing parent analytics for a childrens math app. The screen displays: a line chart showing accuracy trends going upward over 30 days, a bar chart showing daily practice sessions, and key metric cards showing "94% Accuracy" "23 Day Streak" "Level 3A Progress". Colors are teal and orange with white cards on a light gray background. Clean data visualization, modern dashboard UI design. 16:9 aspect ratio.'
  },
  {
    filename: 'mockup-05-homework-helper.png',
    prompt: 'A mobile app screen showing a homework helper feature. The screen is split: the top half shows a photo of a real math worksheet with handwritten problems. The bottom half shows cleanly extracted math problems in a list with checkboxes next to each. An AI tutor character appears at the bottom with step-by-step explanation text. Clean modern UI, teal accent color, professional look. 16:9 aspect ratio on a clean background.'
  },
  {
    filename: 'mockup-06-video-library.png',
    prompt: 'A modern app screen showing a video library grid. Category cards arranged in a 2-column grid: "Counting" with a number icon, "Adding" with a plus icon, "Fractions" with a pie chart icon, "Algebra" with an x icon. Some cards have a green checkmark "Unlocked" badge, others have a small lock icon. At the top is a horizontal carousel of "Recommended Videos" thumbnails. Teal and orange accent colors, white cards, modern UI design. 16:9 aspect ratio.'
  },
  {
    filename: 'mockup-07-share-card.png',
    prompt: 'A square shareable achievement card design for social media. Clean white card with teal decorative border and gold corner ornaments. Center shows a large smiling child emoji avatar with a subtle shadow. Below it a gold badge icon with "Level Master!" text. A motivational quote "Every problem solved is a step forward" in elegant text. At the bottom the MindFoundry brand name in orange with a brain emoji. Modern flat design, celebration theme. Square format 1:1 ratio.'
  }
];

async function generateImage(prompt, filename) {
  console.log(`\n  Generating: ${filename}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  const MODEL = 'gemini-3-pro-image-preview';

  const requestBody = JSON.stringify({
    contents: [{
      parts: [{ text: `Generate a high quality UI mockup image: ${prompt}` }]
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT']
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                const outputPath = path.join(OUTPUT_DIR, filename);
                fs.writeFileSync(outputPath, imageBuffer);
                const sizeKB = (imageBuffer.length / 1024).toFixed(0);
                console.log(`   Saved: ${outputPath} (${sizeKB}KB)`);
                resolve(outputPath);
                return;
              }
            }
          }
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }
          reject(new Error('No image data in response'));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

async function main() {
  console.log('MindFoundry Video-001 - App Mockup Generation');
  console.log('='.repeat(50));
  console.log(`   Model: Nano Banana Pro`);
  console.log(`   Mockups: ${mockupPrompts.length}`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);

  if (!GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY not found in .env');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const { prompt, filename } of mockupPrompts) {
    try {
      const result = await generateImage(prompt, filename);
      results.push({ filename, success: true, path: result });
      await new Promise(r => setTimeout(r, 3000));
    } catch (error) {
      console.error(`   Failed: ${error.message}`);
      results.push({ filename, success: false, error: error.message });
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n' + '='.repeat(50));
  const successful = results.filter(r => r.success);
  console.log(`Generated: ${successful.length}/${results.length} mockups`);
  console.log('\nMockup generation complete!');
}

main().catch(console.error);
