/// <reference lib="webworker" />

const MAX_SIDE = 2048;
const THUMB_SIDE = 320;
const SKIP_SIZE = 1024 * 1024;
const JPEG_QUALITY = 0.82;
const THUMB_QUALITY = 0.7;

const isHeic = (f: File) => /\.(heic|heif)$/i.test(f.name) || /^image\/hei[cf]$/i.test(f.type);

async function render(bitmap: ImageBitmap, maxSide: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.convertToBlob({ type: 'image/jpeg', quality });
}

addEventListener('message', async ({ data }: MessageEvent<{ file: File }>) => {
  const { file } = data;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    try {
      const thumb = await render(bitmap, THUMB_SIDE, THUMB_QUALITY);

      const heic = isHeic(file);
      const big = Math.max(bitmap.width, bitmap.height) > MAX_SIDE;
      let out: File = file;

      if (heic || big || file.size > SKIP_SIZE) {
        const blob = await render(bitmap, MAX_SIDE, JPEG_QUALITY);
        if (heic || blob.size < file.size) {
          out = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
        }
      }
      postMessage({ file: out, thumb });
    } finally {
      bitmap.close();
    }
  } catch {
    // браузер не смог декодировать (например HEIC не в Safari) — уходит оригинал
    postMessage({ file, thumb: null });
  }
});
