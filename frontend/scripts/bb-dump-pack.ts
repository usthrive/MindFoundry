/**
 * Dump one generated WeeklyConceptPack as JSON, for the reader evaluation.
 *
 * The style gate judges what a child is actually served, so its judges must
 * read GENERATED packs at concrete seeds — never the template source. This is
 * the dumper they use.
 *
 * Run: npx tsx scripts/bb-dump-pack.ts <level> <week> <seed> [outfile]
 */
import { writeFileSync } from 'fs';
import { generatePack, CONTENT_VERSION } from '../src/modules/best-brains/generator/packGenerator';

const [level, weekStr, seedStr, out] = process.argv.slice(2);
if (!level || !weekStr || !seedStr) {
  console.error('usage: npx tsx scripts/bb-dump-pack.ts <level> <week> <seed> [outfile]');
  process.exit(1);
}
const pack = generatePack(level.toUpperCase(), Number(weekStr), Number(seedStr), CONTENT_VERSION);
const json = JSON.stringify(pack, null, 1);
if (out) {
  writeFileSync(out, json);
  console.log(`wrote ${out} (${json.length} bytes)`);
} else {
  console.log(json);
}
