/**
 * Favicon generation — the raster half.
 *
 * `sharp` is a native Node module. It cannot load in workerd, so nothing here
 * may be imported by a page or by a prerendered endpoint when building for
 * Cloudflare. These are called from the `favicon-assets` integration in
 * `astro.config.mjs`, which runs in `astro:build:done` — always in Node, on
 * every adapter.
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { buildFaviconSvg } from './svg.ts';

/** Rasterise the favicon SVG to a square PNG buffer of the given pixel size. */
export async function renderFaviconPng(
  letter: string,
  bgColor: string,
  size: number,
  fgColor = '#ffffff'
): Promise<Buffer> {
  const svg = buildFaviconSvg(letter, bgColor, fgColor, size);
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

/** Build a multi-size favicon.ico (16/32/48) from the outlined SVG. */
export async function renderFaviconIco(
  letter: string,
  bgColor: string,
  fgColor = '#ffffff'
): Promise<Buffer> {
  const pngs = await Promise.all(
    [16, 32, 48].map((s) => renderFaviconPng(letter, bgColor, s, fgColor))
  );
  return pngToIco(pngs);
}

/** Resize a square source image to a PNG favicon of the given pixel size. */
export async function renderImageFaviconPng(source: string, size: number): Promise<Buffer> {
  return sharp(source).resize(size, size, { fit: 'cover' }).png().toBuffer();
}

/** Build a multi-size favicon.ico (16/32/48) from a source image. */
export async function renderImageFaviconIco(source: string): Promise<Buffer> {
  const pngs = await Promise.all([16, 32, 48].map((s) => renderImageFaviconPng(source, s)));
  return pngToIco(pngs);
}

/**
 * favicon.svg for an image favicon: a 64px PNG embedded in an SVG wrapper,
 * so the `image/svg+xml` link and the manifest entry keep working unchanged.
 */
export async function renderImageFaviconSvg(source: string): Promise<string> {
  const png = await renderImageFaviconPng(source, 64);
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" width="64" height="64">' +
    `<image width="64" height="64" href="data:image/png;base64,${png.toString('base64')}"/></svg>`
  );
}
