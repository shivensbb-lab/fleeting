// node render.mjs beats            → one still per beat in stills/
// node render.mjs audio            → out/audio.wav
// node render.mjs video [workers]  → out/video.mp4 (60 fps, 3 subframes per frame blended with tmix)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import { spawn, execFileSync } from 'child_process'; import { fileURLToPath } from 'url';
const DIR = path.dirname(fileURLToPath(import.meta.url)), URL = 'file://' + path.join(DIR, 'index.html');
const mode = process.argv[2] || "beats", FPS = 60, SUB = 3, DUR = 20;
fs.mkdirSync(path.join(DIR, 'out'), { recursive: true });
async function page(browser) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto(URL); await p.waitForFunction(() => window.READY === true); return p;
}
const shot = async (p, t) => { await p.evaluate(t => window.seek(t), t); return p.screenshot({ type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: 1920, height: 1080 } }); };
const browser = await chromium.launch();
if (mode === 'beats') {
  const p = await page(browser); fs.mkdirSync(path.join(DIR, 'stills'), { recursive: true });
  const ts = process.argv.slice(3).length ? process.argv.slice(3).map(Number) : Array.from({ length: 40 }, (_, i) => i * 0.5 + 0.3);
  for (const t of ts) fs.writeFileSync(path.join(DIR, 'stills', `t_${t.toFixed(2)}.jpg`), await shot(p, t));
  console.log('stills', ts.length);
} else if (mode === 'audio') {
  const p = await page(browser); const b64 = await p.evaluate(() => window.renderAudio());
  fs.writeFileSync(path.join(DIR, 'out', 'audio.wav'), Buffer.from(b64, 'base64')); console.log('out/audio.wav');
} else {
  const workers = +(process.argv[3] || 4), frames = FPS * DUR, per = Math.ceil(frames / workers), segs = [];
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const f0 = w * per, f1 = Math.min(frames, f0 + per); if (f0 >= f1) return;
    const seg = path.join(DIR, 'out', `seg_${w}.mp4`); segs[w] = seg;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'mjpeg', '-i', '-',
      '-vf', `tmix=frames=${SUB}:weights='1 1 1',select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`, '-r', String(FPS),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const p = await page(browser);
    for (let f = f0; f < f1; f++) for (let s = 0; s < SUB; s++) {
      const buf = await shot(p, f / FPS - (SUB - 1 - s) / (FPS * SUB));   // trailing shutter: frame f blends the 2 sub-moments before it
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('worker', w, 'done', f1 - f0, 'frames');
  }));
  fs.writeFileSync(path.join(DIR, 'out', 'segs.txt'), segs.filter(Boolean).map(s => `file '${path.basename(s)}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'segs.txt', '-c', 'copy', 'video.mp4'], { cwd: path.join(DIR, 'out') });
  console.log('out/video.mp4');
}
await browser.close();
