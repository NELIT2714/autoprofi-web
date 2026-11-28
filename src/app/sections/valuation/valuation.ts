import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18n } from '../../core/i18n/i18n';
import { API_URL } from '../../core/app';

interface Photo {
  id: number;
  file: File;
  url: string;
  preview: boolean;
  state: 'processing' | 'ready';
}

type PhotoError = 'type' | 'size' | 'count';

const MAX_PHOTOS = 15;
const MAX_SIZE = 20 * 1024 * 1024;
const MAX_SIDE = 2048;
const SKIP_SIZE = 1024 * 1024;
const JPEG_QUALITY = 0.82;
const CONCURRENCY = 2;

@Component({
  selector: 'app-valuation',
  imports: [],
  templateUrl: './valuation.html',
})
export class Valuation {
  protected t = inject(I18n).t;
  private http = inject(HttpClient);

  protected readonly maxPhotos = MAX_PHOTOS;

  private nextId = 0;
  private queue: Photo[] = [];
  private active = 0;

  protected name = signal('');
  protected car = signal('');
  protected message = signal('');
  protected website = signal('');
  protected phoneDigits = signal('');
  protected photos = signal<Photo[]>([]);
  protected photoError = signal<PhotoError | null>(null);
  protected dragging = signal(false);
  protected submitted = signal(false);
  protected status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  protected phoneDisplay = computed(() => {
    const d = this.phoneDigits();
    return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.queue = [];
      this.photos().forEach((p) => URL.revokeObjectURL(p.url));
    });
  }

  protected onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('380')) d = d.slice(3);
    else if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 9);
    this.phoneDigits.set(d);
    input.value = this.phoneDisplay();
  }

  protected onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  protected removePhoto(photo: Photo) {
    this.queue = this.queue.filter((p) => p.id !== photo.id);
    URL.revokeObjectURL(photo.url);
    this.photos.update((list) => list.filter((p) => p.id !== photo.id));
    this.photoError.set(null);
  }

  protected async submit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (!this.name().trim() || !this.car().trim() || this.phoneDigits().length !== 9) return;
    if (this.status() === 'sending') return;

    this.status.set('sending');
    await this.whenIdle();

    const body = new FormData();
    body.append('name', this.name().trim());
    body.append('phone', `+380${this.phoneDigits()}`);
    body.append('car', this.car().trim());
    if (this.message().trim()) body.append('message', this.message().trim());
    if (this.website()) body.append('website', this.website());
    this.photos().forEach((p) => body.append('photos', p.file));

    this.http.post(`${API_URL}/v1/leads`, body).subscribe({
      next: () => {
        this.status.set('success');
        this.reset();
      },
      error: () => this.status.set('error'),
    });
  }

  private async whenIdle() {
    while (this.photos().some((p) => p.state === 'processing')) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  private isHeic(file: File) {
    return /\.(heic|heif)$/i.test(file.name) || /^image\/hei[cf]$/i.test(file.type);
  }

  private isImage(file: File) {
    return file.type.startsWith('image/') || this.isHeic(file);
  }

  private addFiles(files: File[]) {
    this.photoError.set(null);
    const added: Photo[] = [];

    for (const file of files) {
      if (!this.isImage(file)) {
        this.photoError.set('type');
        continue;
      }
      if (file.size > MAX_SIZE) {
        this.photoError.set('size');
        continue;
      }
      if (this.photos().length + added.length >= MAX_PHOTOS) {
        this.photoError.set('count');
        break;
      }
      added.push({
        id: this.nextId++,
        file,
        url: URL.createObjectURL(file),
        preview: !this.isHeic(file),
        state: 'processing',
      });
    }

    if (!added.length) return;
    this.photos.update((list) => [...list, ...added]);
    this.queue.push(...added);
    this.pump();
  }

  private pump() {
    while (this.active < CONCURRENCY && this.queue.length) {
      const photo = this.queue.shift()!;
      this.active++;
      this.process(photo).finally(() => {
        this.active--;
        this.pump();
      });
    }
  }

  private async process(photo: Photo) {
    let result: { file: File; preview: boolean };
    try {
      result = await this.compress(photo.file);
    } catch {
      result = { file: photo.file, preview: !this.isHeic(photo.file) };
    }

    if (!this.photos().some((p) => p.id === photo.id)) return;

    const replaceUrl = !photo.preview && result.preview;
    const url = replaceUrl ? URL.createObjectURL(result.file) : photo.url;
    if (replaceUrl) URL.revokeObjectURL(photo.url);

    this.photos.update((list) =>
      list.map((p) =>
        p.id === photo.id
          ? { ...p, file: result.file, url, preview: result.preview, state: 'ready' }
          : p,
      ),
    );
  }

  private async compress(file: File): Promise<{ file: File; preview: boolean }> {
    const heic = this.isHeic(file);

    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      return { file, preview: !heic };
    }

    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= SKIP_SIZE && !heic) {
      bitmap.close();
      return { file, preview: true };
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return { file, preview: !heic };
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    canvas.width = 0;
    canvas.height = 0;

    if (!blob || (!heic && blob.size >= file.size)) return { file, preview: !heic };

    const jpeg = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
    return { file: jpeg, preview: true };
  }

  private reset() {
    this.queue = [];
    this.photos().forEach((p) => URL.revokeObjectURL(p.url));
    this.name.set('');
    this.car.set('');
    this.message.set('');
    this.website.set('');
    this.phoneDigits.set('');
    this.photos.set([]);
    this.photoError.set(null);
    this.submitted.set(false);
  }
}
