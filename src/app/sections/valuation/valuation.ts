import { Component, computed, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { I18n } from '../../core/i18n/i18n';
import { API_URL } from '../../core/app';

interface Photo {
  id: number;
  file: File;
  thumbUrl: string | null;
  state: 'processing' | 'ready';
}

interface WorkerResult {
  file: File;
  thumb: Blob | null;
}

type PhotoError = 'type' | 'size' | 'count';

const MAX_PHOTOS = 15;
const MAX_SIZE = 20 * 1024 * 1024;
const WORKERS = 2;

@Component({
  selector: 'app-valuation',
  imports: [],
  templateUrl: './valuation.html',
})
export class Valuation {
  protected t = inject(I18n).t;
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly maxPhotos = MAX_PHOTOS;

  private nextId = 0;
  private queue: Photo[] = [];
  private workers: Worker[] = [];
  private idle: Worker[] = [];

  protected name = signal('');
  protected car = signal('');
  protected message = signal('');
  protected website = signal('');
  protected phoneDigits = signal('');
  protected photos = signal<Photo[]>([]);
  protected photoError = signal<PhotoError | null>(null);
  protected dragging = signal(false);
  protected submitted = signal(false);
  protected progress = signal(0);
  protected status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  protected phoneDisplay = computed(() => {
    const d = this.phoneDigits();
    return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.queue = [];
      this.workers.forEach((w) => w.terminate());
      this.workers = [];
      this.idle = [];
      this.revokeAll();
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
    if (photo.thumbUrl) URL.revokeObjectURL(photo.thumbUrl);
    this.photos.update((list) => list.filter((p) => p.id !== photo.id));
    this.photoError.set(null);
  }

  protected async submit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (!this.name().trim() || !this.car().trim() || this.phoneDigits().length !== 9) return;
    if (this.status() === 'sending') return;

    this.progress.set(0);
    this.status.set('sending');
    await this.whenIdle();

    const body = new FormData();
    body.append('name', this.name().trim());
    body.append('phone', `+380${this.phoneDigits()}`);
    body.append('car', this.car().trim());
    if (this.message().trim()) body.append('message', this.message().trim());
    if (this.website()) body.append('website', this.website());
    this.photos().forEach((p) => body.append('photos', p.file));

    this.http
      .post(`${API_URL}/v1/leads`, body, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (e) => {
          if (e.type === HttpEventType.UploadProgress && e.total) {
            this.progress.set(Math.round((e.loaded / e.total) * 100));
          } else if (e.type === HttpEventType.Response) {
            this.status.set('success');
            this.reset();
          }
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
      added.push({ id: this.nextId++, file, thumbUrl: null, state: 'processing' });
    }

    if (!added.length) return;
    this.photos.update((list) => [...list, ...added]);

    if (!this.initWorkers()) {
      // воркеры недоступны — отправляем оригиналы как есть
      added.forEach((p) => this.finish(p, { file: p.file, thumb: null }));
      return;
    }
    this.queue.push(...added);
    this.pump();
  }

  private initWorkers(): boolean {
    if (this.workers.length) return true;
    if (!this.isBrowser || typeof Worker === 'undefined') return false;
    try {
      for (let i = 0; i < WORKERS; i++) {
        const w = new Worker(new URL('./photo.worker', import.meta.url), { type: 'module' });
        this.workers.push(w);
        this.idle.push(w);
      }
      return true;
    } catch {
      this.workers.forEach((w) => w.terminate());
      this.workers = [];
      this.idle = [];
      return false;
    }
  }

  private pump() {
    while (this.idle.length && this.queue.length) {
      const worker = this.idle.pop()!;
      const photo = this.queue.shift()!;

      const release = (result: WorkerResult) => {
        worker.onmessage = null;
        worker.onerror = null;
        this.finish(photo, result);
        this.idle.push(worker);
        this.pump();
      };

      worker.onmessage = ({ data }: MessageEvent<WorkerResult>) => release(data);
      worker.onerror = () => release({ file: photo.file, thumb: null });
      worker.postMessage({ file: photo.file });
    }
  }

  private finish(photo: Photo, result: WorkerResult) {
    // пока фото обрабатывалось, его могли удалить
    if (!this.photos().some((p) => p.id === photo.id)) return;

    const thumbUrl = result.thumb ? URL.createObjectURL(result.thumb) : null;
    this.photos.update((list) =>
      list.map((p) =>
        p.id === photo.id ? { ...p, file: result.file, thumbUrl, state: 'ready' } : p,
      ),
    );
  }

  private revokeAll() {
    this.photos().forEach((p) => p.thumbUrl && URL.revokeObjectURL(p.thumbUrl));
  }

  private reset() {
    this.queue = [];
    this.revokeAll();
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
