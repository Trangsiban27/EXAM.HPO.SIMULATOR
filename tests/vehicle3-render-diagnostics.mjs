import fs from 'node:fs/promises';
import path from 'node:path';

// Use an installed Puppeteer module; no package or asset downloads are needed.
const { puppeteer: named, default: fallback } = await import(process.env.VIOS_PUPPETEER_MODULE ?? 'puppeteer');
const puppeteer = named ?? fallback;
const output = process.env.VIOS_DIAGNOSTICS_DIR ?? '/private/tmp/vios-diagnostics';
await fs.mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
    executablePath: process.env.VIOS_CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true, userDataDir: path.join(output, 'chrome-profile'),
    args: ['--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-dev-shm-usage'],
});
try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1 });
    page.on('pageerror', error => console.error(error));
    await page.goto('http://127.0.0.1:5173/tests/fixtures/vios-render-diagnostics.html');
    await page.waitForFunction(() => window.diagnosticsReady, { timeout: 60000 });
    const info = await page.evaluate(() => ({ materials: window.viosDiagnostics.materialInfo,
        shadows: window.viosDiagnostics.originalSun }));
    await fs.writeFile(path.join(output, 'materials.json'), JSON.stringify(info, null, 2));
    const results = [];
    const variants = [
        { variant: 'baseline' }, { variant: 'no-shadow' }, { variant: 'unlit' }, { variant: 'neutral' },
        { variant: 'no-receive' }, { variant: 'no-cast' },
        { variant: 'clip-range', near: .5, far: 60 },
        { variant: 'bias-only', bias: -.00005 },
        { variant: 'normal-bias-only', normalBias: .03 },
        { variant: 'tuned', bias: -.00005, normalBias: .03 },
        { variant: 'bias-medium', bias: -.0002, normalBias: .03 },
        { variant: 'bias-larger', bias: -.0003, normalBias: .03 },
        { variant: 'normal-larger', bias: -.0001, normalBias: .08 },
        { variant: 'normal-largest', bias: -.0001, normalBias: .15 },
        { variant: 'fixed' },
        { variant: 'bias-high', bias: -.0005, normalBias: .04, view: 'top' },
        { variant: 'fixed-front-shadow', view: 'top' },
        { variant: 'fixed-back-shadow', view: 'top' },
        { variant: 'fixed-glass-no-receive', view: 'top' },
        { variant: 'fixed-glass-no-cast', view: 'top' },
        { variant: 'fixed-glass-hidden', view: 'top' },
    ];
    for (const options of variants) {
        const result = await page.evaluate(async options => {
            const result = await window.viosDiagnostics.render({ view: 'diagonal', ...options });
            const source = window.viosDiagnostics.renderer.domElement;
            const canvas = document.createElement('canvas'); canvas.width = source.width; canvas.height = source.height;
            const ctx = canvas.getContext('2d'); ctx.drawImage(source, 0, 0);
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            if (!window.originalPixels) window.originalPixels = new Uint8ClampedArray(pixels);
            let difference = 0, changed = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                const diff = Math.abs(pixels[i] - window.originalPixels[i])
                    + Math.abs(pixels[i + 1] - window.originalPixels[i + 1])
                    + Math.abs(pixels[i + 2] - window.originalPixels[i + 2]);
                difference += diff; if (diff > 6) changed++;
            }
            return { ...result, meanPixelDifference: difference / (pixels.length / 4), changedPixels: changed };
        }, options);
        results.push(result);
        await page.screenshot({ path: path.join(output, `${options.variant}.png`) });
        console.log(JSON.stringify(result));
    }
    for (const view of ['top', 'side', 'front', 'rear', 'cabin']) {
        for (const variant of ['baseline', 'fixed']) {
            await page.evaluate(options => window.viosDiagnostics.render(options),
                { view, variant });
            await page.screenshot({ path: path.join(output, `${view}-${variant}.png`) });
        }
        console.log(`Captured ${view}`);
    }
    await fs.writeFile(path.join(output, 'comparisons.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); }
