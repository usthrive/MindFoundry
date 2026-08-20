#!/usr/bin/env node
/**
 * MindFoundry Video-001 Voiceover Generator
 * Uses ElevenLabs API with Daniel voice for natural narration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'assets/audio');

// Load video script
const scriptPath = path.join(__dirname, 'video-script.json');

const PREFERRED_VOICES = [
  'Daniel',    // British broadcaster - natural
  'George',    // Warm storyteller
  'Brian',     // Deep, resonant
  'Bill',      // Wise, mature
];

// Scene pause configuration (seconds of silence after each scene)
const SCENE_PAUSES = {
  'hook': 0.5,
  'problem-cost': 0.3,
  'problem-gap': 1.0,        // Dramatic pause before solution
  'solution-intro': 0.5,
  'solution-method': 0.3,
  'demo-practice': 0.3,
  'demo-celebrate': 0.3,
  'feature-dashboard': 0.3,
  'feature-homework': 0.3,
  'feature-library': 0.3,
  'proof-numbers': 0.5,
  'proof-family': 0.5,
  'cta': 0                    // No pause after final scene
};

async function listVoices() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: '/v1/voices',
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function generateAudioSegment(text, voiceId, outputFilename) {
  console.log(`   Generating: ${outputFilename}`);
  console.log(`   Text: "${text.substring(0, 70)}..."`);

  const requestBody = JSON.stringify({
    text: text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.7,
      similarity_boost: 0.5,
      style: 0.1,
      use_speaker_boost: false
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let error = '';
        res.on('data', chunk => error += chunk);
        res.on('end', () => {
          reject(new Error(`ElevenLabs API error ${res.statusCode}: ${error}`));
        });
        return;
      }

      const outputPath = path.join(OUTPUT_DIR, outputFilename);
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });
      fileStream.on('error', reject);
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

function getAudioDuration(filePath) {
  try {
    const ffprobePath = process.env.HOME + '/.local/bin/ffprobe';
    const ffprobeCmd = fs.existsSync(ffprobePath) ? ffprobePath : 'ffprobe';
    const result = execSync(
      `${ffprobeCmd} -v quiet -print_format json -show_format "${filePath}"`,
      { encoding: 'utf8' }
    );
    return parseFloat(JSON.parse(result).format.duration);
  } catch (e) {
    console.error(`   Warning: Could not get duration for ${filePath}`);
    return 0;
  }
}

function generateSilence(duration, outputPath) {
  try {
    const ffmpegPath = process.env.HOME + '/.local/bin/ffmpeg';
    const ffmpegCmd = fs.existsSync(ffmpegPath) ? ffmpegPath : 'ffmpeg';
    execSync(
      `${ffmpegCmd} -y -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} -q:a 9 "${outputPath}"`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    return true;
  } catch (e) {
    console.error(`   Warning: Could not generate silence`);
    return false;
  }
}

function concatenateAudio(inputFiles, outputPath) {
  const concatFilePath = path.join(OUTPUT_DIR, 'concat.txt');
  const concatContent = inputFiles.map(f => `file '${path.basename(f)}'`).join('\n');
  fs.writeFileSync(concatFilePath, concatContent);

  try {
    const ffmpegPath = process.env.HOME + '/.local/bin/ffmpeg';
    const ffmpegCmd = fs.existsSync(ffmpegPath) ? ffmpegPath : 'ffmpeg';
    execSync(
      `${ffmpegCmd} -y -f concat -safe 0 -i "${concatFilePath}" -c:a libmp3lame -q:a 2 "${outputPath}"`,
      { encoding: 'utf8', stdio: 'pipe', cwd: OUTPUT_DIR }
    );
    fs.unlinkSync(concatFilePath);
    return true;
  } catch (e) {
    console.error(`   Error concatenating audio:`, e.message);
    return false;
  }
}

async function main() {
  console.log('MindFoundry Video-001 - Voiceover Generation');
  console.log('='.repeat(55));
  console.log('   Provider: ElevenLabs | Model: eleven_multilingual_v2');
  console.log('   Features: Per-scene sync, natural pacing\n');

  if (!ELEVENLABS_API_KEY) {
    console.error('ELEVENLABS_API_KEY not found in .env');
    process.exit(1);
  }

  if (!fs.existsSync(scriptPath)) {
    console.error('video-script.json not found at:', scriptPath);
    process.exit(1);
  }

  const videoScript = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Find voice
  console.log('Selecting voice...');
  const voicesResponse = await listVoices();
  const voices = voicesResponse.voices || [];

  let selectedVoice = null;
  for (const preferred of PREFERRED_VOICES) {
    selectedVoice = voices.find(v =>
      v.name.toLowerCase().startsWith(preferred.toLowerCase())
    );
    if (selectedVoice) break;
  }

  if (!selectedVoice) {
    console.error('No preferred voice found');
    console.log('   Available:', voices.map(v => v.name).join(', '));
    process.exit(1);
  }

  console.log(`   Selected: ${selectedVoice.name} (${selectedVoice.voice_id})`);
  console.log(`   Description: ${selectedVoice.labels?.description || 'N/A'}\n`);

  // Generate per-scene audio
  const scenes = videoScript.scenes;
  const audioFiles = [];
  let totalDuration = 0;
  const sceneDurations = {};

  console.log('Generating per-scene audio...\n');

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const pauseAfter = SCENE_PAUSES[scene.id] || 0.3;

    console.log(`Scene ${i + 1}/${scenes.length}: ${scene.id}`);

    const audioFile = path.join(OUTPUT_DIR, `scene-${String(i + 1).padStart(2, '0')}-${scene.id}.mp3`);

    try {
      await generateAudioSegment(scene.voiceover.text, selectedVoice.voice_id, path.basename(audioFile));

      const audioDuration = getAudioDuration(audioFile);
      console.log(`   Duration: ${audioDuration.toFixed(2)}s (target: ${scene.duration}s)`);

      audioFiles.push(audioFile);
      sceneDurations[scene.id] = audioDuration;
      totalDuration += audioDuration;

      // Add pause
      if (pauseAfter > 0) {
        const pauseFile = path.join(OUTPUT_DIR, `pause-${String(i + 1).padStart(2, '0')}.mp3`);
        generateSilence(pauseAfter, pauseFile);
        audioFiles.push(pauseFile);
        totalDuration += pauseAfter;
        sceneDurations[scene.id] += pauseAfter;
      }

      console.log('');
      await new Promise(r => setTimeout(r, 500)); // Rate limit

    } catch (error) {
      console.error(`   Failed: ${error.message}`);
    }
  }

  console.log('='.repeat(55));
  console.log(`Total audio duration: ${totalDuration.toFixed(2)}s\n`);

  // Concatenate
  console.log('Concatenating audio segments...');
  const finalOutput = path.join(OUTPUT_DIR, 'narration.mp3');

  if (concatenateAudio(audioFiles, finalOutput)) {
    const finalDuration = getAudioDuration(finalOutput);
    console.log(`   Final: ${finalOutput}`);
    console.log(`   Duration: ${finalDuration.toFixed(2)}s`);

    // Clean up individual files
    console.log('\nCleaning up temp files...');
    for (const file of audioFiles) {
      try { fs.unlinkSync(file); } catch (e) {}
    }

    // Output timing data for Remotion
    console.log('\nScene Durations (for Remotion sync):');
    console.log('Copy this to your composition:\n');
    console.log('const audioDurations = {');
    for (const [sceneId, duration] of Object.entries(sceneDurations)) {
      const camelCase = sceneId.replace(/-([a-z])/g, g => g[1].toUpperCase());
      console.log(`  ${camelCase}: ${duration.toFixed(2)},`);
    }
    console.log('};');

    // Save durations to JSON for easy import
    const durationsPath = path.join(OUTPUT_DIR, 'scene-durations.json');
    fs.writeFileSync(durationsPath, JSON.stringify(sceneDurations, null, 2));
    console.log(`\nDurations saved to: ${durationsPath}`);
  }

  console.log('\n' + '='.repeat(55));
  console.log('Voiceover generation complete!');
}

main().catch(console.error);
