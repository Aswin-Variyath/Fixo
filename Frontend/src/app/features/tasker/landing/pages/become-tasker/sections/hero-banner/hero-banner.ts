import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

/** Total number of animation frames */
const TOTAL_FRAMES = 192;

/** Number of frames to preload immediately before rendering the first frame */
const INITIAL_BATCH = 10;

/** Base URL prefix for animation frames */
const FRAME_BASE = '/animation_images/become_a_tasker_hero_section/';

@Component({
  selector: 'app-hero-banner',
  imports: [],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBanner implements AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas')         private canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Preloaded HTMLImageElement array; index = frame number (0-based) */
  private frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

  /** Whether the first frame has been painted */
  private firstFramePainted = false;

  /** Canvas 2D rendering context */
  private ctx!: CanvasRenderingContext2D;

  /** Last drawn frame index (0-based) */
  private lastDrawnFrame = -1;

  /** Target frame index driven by scroll position */
  private targetFrame = 0;

  /** Smoothed current frame (float) for eased interpolation */
  private currentFrame = 0;

  /** requestAnimationFrame handle */
  private rafId: number | null = null;

  /** AbortController signal used to remove the scroll listener on destroy */
  private scrollListenerAbort!: AbortController;

  /** ResizeObserver for responsive canvas sizing */
  private resizeObserver!: ResizeObserver;

  /** Whether prefers-reduced-motion media query is active */
  private reducedMotion = false;

  /** Device pixel ratio (capped at 2 for performance) */
  private dpr = 1;

  /** Natural frame dimensions taken from the first loaded image */
  private naturalWidth  = 1920;
  private naturalHeight = 1080;

  /** Scroll progress within the hero zone [0, 1] */
  private scrollProgress = 0;

  constructor(private ngZone: NgZone) {}

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.reducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;

      // Observe the scroll container for viewport/resize changes
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.scrollContainerRef.nativeElement);

      this.onResize();
      this.startPreloading();
      this.attachScrollListener();

      if (!this.reducedMotion) {
        this.startRenderLoop();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.scrollListenerAbort) {
      this.scrollListenerAbort.abort();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Frame URL generation
  // ─────────────────────────────────────────────────────────────────────────

  private buildFrameUrl(index: number): string {
    // index is 0-based; filenames are 1-based with 3-digit zero-padding
    const n      = index + 1;
    const padded = n.toString().padStart(3, '0');
    return `${FRAME_BASE}frame-${padded}.webp`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Preloading strategy
  // ─────────────────────────────────────────────────────────────────────────

  private startPreloading(): void {
    // Phase 1: load the first INITIAL_BATCH frames immediately so frame 0 can
    // be painted before the user starts scrolling.
    this.loadFrameRange(0, INITIAL_BATCH - 1, () => {
      if (!this.firstFramePainted && this.frames[0]) {
        this.naturalWidth  = this.frames[0]!.naturalWidth  || 1920;
        this.naturalHeight = this.frames[0]!.naturalHeight || 1080;
        this.onResize();
        this.drawFrame(0);
        this.firstFramePainted = true;
      }
      // Phase 2: load remaining frames in idle-time batches
      this.loadRemainingFramesAsync(INITIAL_BATCH);
    });
  }

  /** Load frames [startIdx, endIdx] in parallel; fire onComplete when all done. */
  private loadFrameRange(startIdx: number, endIdx: number, onComplete: () => void): void {
    let remaining = endIdx - startIdx + 1;

    const done = () => {
      remaining--;
      if (remaining === 0) onComplete();
    };

    for (let i = startIdx; i <= endIdx; i++) {
      this.loadSingleFrame(i, done);
    }
  }

  /**
   * Load remaining frames in batches of 8 using requestIdleCallback so the
   * main thread is never blocked by image decoding work.
   */
  private loadRemainingFramesAsync(startIdx: number): void {
    const batchSize = 8;
    let current = startIdx;

    const loadBatch = () => {
      if (current >= TOTAL_FRAMES) return;

      const end = Math.min(current + batchSize - 1, TOTAL_FRAMES - 1);

      this.loadFrameRange(current, end, () => {
        current = end + 1;
        if (current < TOTAL_FRAMES) {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(loadBatch, { timeout: 200 });
          } else {
            setTimeout(loadBatch, 16);
          }
        }
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadBatch, { timeout: 200 });
    } else {
      setTimeout(loadBatch, 100);
    }
  }

  private loadSingleFrame(index: number, onLoaded: () => void): void {
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      this.frames[index] = img;
      // Paint frame 0 as early as possible
      if (index === 0 && !this.firstFramePainted) {
        this.naturalWidth  = img.naturalWidth  || 1920;
        this.naturalHeight = img.naturalHeight || 1080;
        this.onResize();
        this.drawFrame(0);
        this.firstFramePainted = true;
      }
      onLoaded();
    };

    img.onerror = () => {
      // Gracefully tolerate missing frames
      this.frames[index] = null;
      onLoaded();
    };

    img.src = this.buildFrameUrl(index);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Canvas sizing — retina-aware, aspect-ratio cover
  // ─────────────────────────────────────────────────────────────────────────

  private onResize(): void {
    const container = this.scrollContainerRef.nativeElement;
    const canvas    = this.canvasRef.nativeElement;

    // Use viewport dimensions: the scroll container is 300vh tall (the scroll
    // zone), so window dimensions represent the visible sticky area.
    const containerW = container.clientWidth || window.innerWidth;
    const containerH = window.innerHeight;

    // Cover the viewport while maintaining the frame aspect ratio
    const aspectRatio = this.naturalWidth / this.naturalHeight;
    let drawW = containerW;
    let drawH = containerW / aspectRatio;

    if (drawH < containerH) {
      drawH = containerH;
      drawW = containerH * aspectRatio;
    }

    // Set CSS display size
    canvas.style.width  = `${drawW}px`;
    canvas.style.height = `${drawH}px`;

    // Set physical backing-store size for retina displays
    canvas.width  = Math.round(drawW * this.dpr);
    canvas.height = Math.round(drawH * this.dpr);

    this.ctx.scale(this.dpr, this.dpr);

    // Redraw the current frame immediately after resize
    this.drawFrame(this.lastDrawnFrame >= 0 ? this.lastDrawnFrame : 0);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Scroll handling
  // ─────────────────────────────────────────────────────────────────────────

  private attachScrollListener(): void {
    this.scrollListenerAbort = new AbortController();
    window.addEventListener(
      'scroll',
      () => this.onScroll(),
      { passive: true, signal: this.scrollListenerAbort.signal },
    );
  }

  private onScroll(): void {
    const container      = this.scrollContainerRef.nativeElement;
    const rect           = container.getBoundingClientRect();
    const totalScrollable = container.offsetHeight - window.innerHeight;

    if (totalScrollable <= 0) return;

    // Distance scrolled into this section
    const scrolled = -rect.top;
    this.scrollProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

    // Map scroll progress → target frame index
    this.targetFrame = Math.round(this.scrollProgress * (TOTAL_FRAMES - 1));

    // Reduced-motion: snap to frame immediately (no rAF loop running)
    if (this.reducedMotion) {
      this.currentFrame = this.targetFrame;
      this.drawFrame(this.targetFrame);
    }
    // Normal mode: the rAF loop reads targetFrame and interpolates smoothly.
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render loop — Apple-style smooth frame interpolation
  // ─────────────────────────────────────────────────────────────────────────

  private startRenderLoop(): void {
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);

      const diff = this.targetFrame - this.currentFrame;
      if (Math.abs(diff) < 0.1) {
        this.currentFrame = this.targetFrame;
      } else {
        // 18% easing per frame — silky-smooth without feeling laggy
        this.currentFrame += diff * 0.18;
      }

      const frameIndex = Math.round(this.currentFrame);
      if (frameIndex !== this.lastDrawnFrame) {
        this.drawFrame(frameIndex);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Frame drawing
  // ─────────────────────────────────────────────────────────────────────────

  private drawFrame(index: number): void {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    const img     = this.frames[clamped];

    if (!img) {
      // Fall back to the nearest already-loaded frame to avoid blank flashes
      const fallback = this.findNearestLoaded(clamped);
      if (fallback === null) return;
      this.drawImage(this.frames[fallback]!);
      this.lastDrawnFrame = fallback;
      return;
    }

    this.drawImage(img);
    this.lastDrawnFrame = clamped;
  }

  private drawImage(img: HTMLImageElement): void {
    const canvas = this.canvasRef.nativeElement;
    // Draw at logical (CSS) pixel size — HiDPI scale is already applied via ctx.scale()
    const w = canvas.width  / this.dpr;
    const h = canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(img, 0, 0, w, h);
  }

  private findNearestLoaded(index: number): number | null {
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const lo = index - offset;
      const hi = index + offset;
      if (lo >= 0             && this.frames[lo]) return lo;
      if (hi < TOTAL_FRAMES   && this.frames[hi]) return hi;
    }
    return null;
  }
}
