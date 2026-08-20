/**
 * bbNotebookExport — the child's level notebook, as one file they keep.
 *
 * FORMAT: a single self-contained HTML document, downloaded to the device.
 *
 * Not a PDF, deliberately. A PDF needs a library (~200 KB+), rasterises the
 * working unless the strokes are re-emitted as vector paths anyway, and gives a
 * family a file they can only read. An HTML page carries the strokes as inline
 * SVG — vector, so it stays sharp at any zoom and on paper — needs no
 * dependency at all, opens on any device offline, and **prints to PDF from the
 * browser** when a family wants one. The print stylesheet puts one page of
 * working on one sheet.
 *
 * Nothing here grades anything. The notebook is a record of how a child worked,
 * carrying the question and their own marks — no score, no correct answer, no
 * verdict. The pad's promise ("Nobody marks this") survives export.
 */

import { decodeStrokes, loadLevel, type NotebookPage } from './bbNotebookStore';
import type { Stroke } from '@/components/ui/ScratchPad';

/** The canvas the strokes were drawn on; SVG inherits its coordinate space. */
const CANVAS_W = 900;
const CANVAS_H = 420;

const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** Strip the authoring bracket — the child never saw `[image: …]` on screen. */
const readable = (prompt: string): string => prompt.replace(/\[image:[^\]]*\]\s*/g, '').trim();

function strokesToSvg(strokes: readonly Stroke[]): string {
  if (!strokes.length) return '';
  const paths = strokes
    .filter((s) => s.points.length > 1)
    .map((s) => {
      const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
      return `<path d="${d}" fill="none" stroke="${esc(s.color)}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join('');
  return `<svg class="work" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="the working">${paths}</svg>`;
}

function pageHtml(page: NotebookPage, n: number): string {
  const svg = strokesToSvg(decodeStrokes(page.data));
  const when = new Date(page.updatedAt).toLocaleDateString();
  return `<section class="page">
  <header><span class="wk">Week ${page.week}</span><span class="when">${esc(when)}</span></header>
  <p class="q">${esc(readable(page.prompt))}</p>
  <div class="pad">${svg || '<p class="empty">(no working on this one)</p>'}</div>
  <footer>${n}</footer>
</section>`;
}

const STYLE = `
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; background: #f6f7f8; color: #1f2933;
  font-family: 'Avenir Next', Avenir, Seravek, 'Trebuchet MS', Verdana, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; }
.sub { color: #66717a; margin: 0 0 24px; font-size: 14px; }
.page { background: #fff; border: 1px solid #e3e6e8; border-radius: 14px;
  padding: 18px; margin: 0 auto 20px; max-width: 960px; page-break-inside: avoid; }
.page header { display: flex; justify-content: space-between; font-size: 12px;
  text-transform: uppercase; letter-spacing: .06em; color: #66717a; margin-bottom: 8px; }
.q { font-size: 18px; margin: 0 0 12px; }
.pad { border: 1px dashed #cfd4d8; border-radius: 10px; background: #fff; }
svg.work { display: block; width: 100%; height: auto; }
.empty { color: #97a0a8; font-style: italic; text-align: center; padding: 28px 0; margin: 0; }
.page footer { text-align: right; font-size: 11px; color: #97a0a8; margin-top: 6px; }
@media print {
  body { background: #fff; padding: 0; }
  .page { border: none; border-radius: 0; margin: 0; max-width: none;
    page-break-after: always; break-after: page; }
  .no-print { display: none; }
}
`;

export function buildNotebookHtml(level: string, pages: readonly NotebookPage[]): string {
  const withWork = pages.filter((p) => p.data.length > 0);
  const body = withWork.map((p, i) => pageHtml(p, i + 1)).join('\n');
  const weeks = new Set(withWork.map((p) => p.week)).size;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Level ${esc(level)} notebook</title>
<style>${STYLE}</style></head>
<body>
<h1>Level ${esc(level)} — my working</h1>
<p class="sub no-print">${withWork.length} page${withWork.length === 1 ? '' : 's'} of working across ${weeks} week${weeks === 1 ? '' : 's'}. Print this page to save it as a PDF.</p>
${body || '<p class="sub">No working saved for this level yet.</p>'}
</body></html>`;
}

/** Gather a level and hand the family a file. Returns how many pages it held. */
export async function downloadNotebook(childId: string, level: string): Promise<number> {
  const pages = await loadLevel(childId, level);
  const html = buildNotebookHtml(level, pages);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `level-${level}-notebook.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick: Safari needs the URL to survive the click.
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return pages.filter((p) => p.data.length > 0).length;
}
