#!/usr/bin/env node
/**
 * MindFoundry Video-001 B-Roll Image Generator
 * Uses Nano Banana Pro (gemini-3-pro-image-preview) for photorealistic images
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'assets/images');

const imagePrompts = [
  {
    filename: 'broll-01-homework-struggle.png',
    prompt: 'A warm-lit cozy living room evening scene. A caring parent and young child around 8 years old sit together at a wooden kitchen table covered with scattered homework papers and pencils. The child looks down at a math worksheet with a confused frustrated expression, pencil in hand. The parent sits beside them looking concerned but supportive. Soft warm lamp lighting. Cinematic composition, photorealistic, shallow depth of field, 16:9 aspect ratio, 4K resolution. No text or watermarks.'
  },
  {
    filename: 'broll-02-erasing.png',
    prompt: 'Close-up macro shot of a small child hand erasing an incorrect math answer on a white worksheet paper with a pink eraser. Eraser shavings and crumbs visible on the paper surface. A crumpled piece of paper sits nearby out of focus. Warm slightly melancholic soft lighting from the side. Photorealistic, shallow depth of field, 16:9 aspect ratio, 4K resolution. No text or watermarks.'
  },
  {
    filename: 'broll-03-world-map.png',
    prompt: 'A stylized modern world map visualization on a dark navy blue background. Glowing teal and warm orange dots mark countries across all continents, representing a global education network. Clean minimalist infographic design. The dots emit a subtle warm glow with thin connecting lines between nearby dots. Professional data visualization style. Dark background, 16:9 aspect ratio, 4K resolution. No text or labels or watermarks.'
  },
  {
    filename: 'broll-04-happy-family.png',
    prompt: 'A warm cozy family scene in a modern living room. A smiling parent sits on a comfortable light-colored couch with two happy children, one around age 6 and one around age 9. Each child holds a tablet device and looks engaged and delighted. The parent looks at their phone with a proud satisfied expression. Warm inviting home environment with soft natural lighting, houseplants, and cozy throws. Photorealistic, warm color grading, 16:9 aspect ratio, 4K resolution. No text or watermarks.'
  },
  {
    filename: 'broll-05-child-celebrating.png',
    prompt: 'A joyful excited child around 7-8 years old raising both small fists in the air in triumphant celebration, with a big genuine smile on their face. They are sitting at a clean desk with a tablet device in front of them showing a math app. Bright uplifting natural lighting from a window. The mood is pure joy and accomplishment. Photorealistic, vibrant warm colors, sharp focus on the child, 16:9 aspect ratio, 4K resolution. No text or watermarks.'
  }
];

async function generateImage(prompt, filename) {
  console.log(`\n  Generating: ${filename}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  const MODEL = 'gemini-3-pro-image-preview';

  const requestBody = JSON.stringify({
    contents: [{
      parts: [{ text: `Generate a photorealistic image: ${prompt}` }]
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
            console.error(`   API Error:`, response.error.message);
            reject(new Error(response.error.message));
            return;
          }

          console.error(`   No image in response:`, JSON.stringify(response).substring(0, 300));
          reject(new Error('No image data in response'));
        } catch (e) {
          console.error(`   Parse error:`, e.message);
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
  console.log('MindFoundry Video-001 - B-Roll Image Generation');
  console.log('='.repeat(50));
  console.log(`   Model: Nano Banana Pro`);
  console.log(`   Images: ${imagePrompts.length}`);
  console.log(`   Output: ${OUTPUT_DIR}\n`);

  if (!GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY not found in .env');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const { prompt, filename } of imagePrompts) {
    try {
      const result = await generateImage(prompt, filename);
      results.push({ filename, success: true, path: result });
      await new Promise(r => setTimeout(r, 3000)); // Rate limit
    } catch (error) {
      console.error(`   Failed: ${error.message}`);
      results.push({ filename, success: false, error: error.message });
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n' + '='.repeat(50));
  const successful = results.filter(r => r.success);
  console.log(`Generated: ${successful.length}/${results.length} images`);

  if (successful.length < results.length) {
    console.log('Failed:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }

  console.log('\nImage generation complete!');
}

main().catch(console.error);
