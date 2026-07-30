/**
 * How many authoring agents can this machine actually run?
 *
 * Measured, not guessed. On 2026-07-29 a fan-out of 7–11 concurrent week-agents
 * repeatedly killed the WSL VM: each agent's self-verify runs `tsc --noEmit`,
 * which peaks at ~800 MB and takes ~110 s, and the VM is capped at 4 GB / 2
 * cores. Agents vanished with no completion record (processes killed) and the
 * Claude Code session itself exited (the Hyper-V watchdog recycling the VM —
 * the same failure the user's own .wslconfig comment documents). A killed agent
 * costs its full 300–450k tokens and returns nothing, so over-subscribing is
 * strictly more expensive than going slower.
 *
 * Run this BEFORE any fan-out and obey the number it prints:
 *   npx tsx scripts/bb-agent-budget.ts
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';

/** Peak RSS of one `tsc --noEmit` on this project, measured 2026-07-29. */
const TSC_PEAK_MB = 800;
/** Headroom left for the OS, the editor, MCP servers and the session itself. */
const RESERVE_MB = 600;

function meminfoMB(key: string): number {
  try {
    const line = fs.readFileSync('/proc/meminfo', 'utf8').split('\n').find((l) => l.startsWith(key));
    return line ? Math.round(Number(line.replace(/\D+/g, '')) / 1024) : 0;
  } catch {
    return 0;
  }
}

const totalMB = meminfoMB('MemTotal:');
const availableMB = meminfoMB('MemAvailable:');
const cores = os.cpus().length;
const load1 = os.loadavg()[0];

// Two independent ceilings; the budget is whichever is tighter.
const byMemory = Math.floor((availableMB - RESERVE_MB) / TSC_PEAK_MB);
// One typecheck saturates a core for ~2 minutes, so leave one core for the
// session's own work and for the seed sweeps agents run between typechecks.
const byCpu = Math.max(1, cores - 1);
const budget = Math.max(1, Math.min(byMemory, byCpu));

console.log(`\nMachine:  ${totalMB} MB total · ${availableMB} MB available · ${cores} cores · load ${load1.toFixed(2)}`);
console.log(`Ceilings: memory allows ${byMemory} · cpu allows ${byCpu}`);
if (load1 > cores * 1.5) {
  console.log(`\n⚠ load ${load1.toFixed(2)} on ${cores} cores is already oversubscribed — let it settle before launching.`);
}
console.log(`\n➜ SAFE CONCURRENT AGENTS: ${budget}\n`);

if (budget < 3) {
  console.log('At this budget, also tell each agent to:');
  console.log('  · iterate on the 200-seed sweep (cheap) and run `tsc --noEmit` at most twice, never in a loop');
  console.log('  · skip `npm run build`, `npm run dev` and the figure-render suite');
  console.log(`\nRaising the WSL cap to 8 GB / 4 cores would allow about ${Math.min(Math.floor((8192 - 1200 - RESERVE_MB) / TSC_PEAK_MB), 3)}–6.\n`);
}

// A quick look at what is already resident, so a surprise hog is visible.
try {
  const top = execSync("ps -eo rss=,comm= --sort=-rss | head -5", { encoding: 'utf8' })
    .trim()
    .split('\n')
    .map((l) => {
      const [rss, ...rest] = l.trim().split(/\s+/);
      return `    ${String(Math.round(Number(rss) / 1024)).padStart(5)} MB  ${rest.join(' ')}`;
    });
  console.log('Largest resident processes:');
  console.log(top.join('\n'));
} catch {
  /* ps unavailable — the budget above stands regardless */
}
