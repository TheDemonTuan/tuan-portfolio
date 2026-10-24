import type { PersonalProject } from "../data/personal-work";
import type { Observatory } from "./observatory-renderer";

type SceneState = "static" | "loading" | "ready" | "paused" | "unavailable";
type Project = { id: string; kind: PersonalProject["kind"] };
type Connection = EventTarget & { saveData?: boolean };

class SystemsObservatory extends HTMLElement {
  private visual: HTMLElement | null = null;
  private fallback: SVGElement | null = null;
  private status: HTMLElement | null = null;
  private pauseButton: HTMLButtonElement | null = null;
  private hero: Element | null = null;
  private projects: readonly Project[] = [];
  private links: readonly HTMLAnchorElement[] | null = null;
  private projectIds = new Map<HTMLAnchorElement, string>();
  private lifecycle: AbortController | null = null;
  private nearObserver: IntersectionObserver | null = null;
  private viewportObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private themeObserver: MutationObserver | null = null;
  private media: MediaQueryList[] = [];
  private connection: Connection | undefined;
  private canvas: HTMLCanvasElement | null = null;
  private observatory: Observatory | null = null;
  private generation = 0;
  private pending = false;
  private nearViewport = false;
  private inViewport = false;
  private unavailable = false;
  private userPaused = false;
  private hovered: string | null = null;
  private focused: string | null = null;

  connectedCallback() {
    if (this.links === null) {
      this.visual = this.querySelector<HTMLElement>(".scene-visual");
      this.fallback = this.querySelector<SVGElement>(".scene-fallback");
      this.status = this.querySelector<HTMLElement>("[data-scene-status]");
      this.pauseButton = this.querySelector<HTMLButtonElement>("[data-scene-pause]");
      this.hero = this.closest(".hero") ?? this;
      this.links = [
        ...this.querySelectorAll<HTMLAnchorElement>(".scene-projects a[data-project-id]"),
      ];
      this.projects = this.links.flatMap((link) => {
        const { projectId: id, projectKind: kind } = link.dataset;
        if (
          !id ||
          (kind !== "original" && kind !== "fork" && kind !== "derived" && kind !== "profile")
        )
          return [];
        this.projectIds.set(link, id);
        return [{ id, kind }];
      });
    }
    window.addEventListener("pageshow", this.onPageShow);
    this.activate();
  }

  disconnectedCallback() {
    window.removeEventListener("pageshow", this.onPageShow);
    this.deactivate();
  }

  private readonly onPageShow = () => {
    if (this.isConnected) this.activate();
  };

  private activate() {
    if (this.lifecycle || !this.visual || !this.fallback) return;
    this.lifecycle = new AbortController();
    const { signal } = this.lifecycle;
    this.nearViewport = false;
    this.inViewport = false;
    this.media = [
      matchMedia("(min-width: 960px)"),
      matchMedia("(pointer: fine) and (hover: hover)"),
      matchMedia("(prefers-reduced-motion: no-preference)"),
    ];
    this.connection = (navigator as Navigator & { connection?: Connection }).connection;
    for (const query of this.media) {
      query.addEventListener("change", this.reconcile, { signal });
    }
    this.connection?.addEventListener("change", this.reconcile, { signal });
    window.addEventListener("pagehide", this.onPageHide, { signal });
    window.addEventListener("resize", this.onResize, { signal, passive: true });
    window.addEventListener("scroll", this.onScroll, { signal, passive: true });
    document.addEventListener("visibilitychange", this.syncMotion, { signal });
    this.visual.addEventListener("pointermove", this.onPointerMove, { signal, passive: true });
    this.visual.addEventListener("pointerleave", this.onPointerLeave, { signal });
    this.addEventListener("pointerover", this.onPointerOver, { signal });
    this.addEventListener("pointerout", this.onPointerOut, { signal });
    this.addEventListener("focusin", this.onFocusIn, { signal });
    this.addEventListener("focusout", this.onFocusOut, { signal });
    this.pauseButton?.addEventListener("click", this.onPause, { signal });

    this.nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        this.nearViewport = entry.isIntersecting;
        this.reconcile();
      },
      { rootMargin: "200px" },
    );
    this.viewportObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      this.inViewport =
        entry.isIntersecting &&
        entry.intersectionRect.width > 0 &&
        entry.intersectionRect.height > 0;
      this.syncMotion();
    });
    this.nearObserver.observe(this);
    this.viewportObserver.observe(this);
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.visual);
    this.themeObserver = new MutationObserver(() => {
      this.withObservatory((scene) => scene.setTheme(this.colors()));
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    this.reconcile();
  }

  private readonly onPageHide = () => this.deactivate();

  private deactivate() {
    this.lifecycle?.abort();
    this.lifecycle = null;
    this.nearObserver?.disconnect();
    this.viewportObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.themeObserver?.disconnect();
    this.nearObserver = null;
    this.viewportObserver = null;
    this.resizeObserver = null;
    this.themeObserver = null;
    this.media = [];
    this.connection = undefined;
    this.hovered = null;
    this.focused = null;
    this.teardownEnhancement();
    this.setState(this.unavailable ? "unavailable" : "static");
  }

  private eligible() {
    return (
      this.media.length === 3 &&
      this.media.every((query) => query.matches) &&
      !this.connection?.saveData
    );
  }

  private readonly reconcile = () => {
    if (!this.lifecycle || !this.isConnected) return;
    if (this.unavailable || !this.eligible()) {
      this.teardownEnhancement();
      this.setState(this.unavailable ? "unavailable" : "static");
      return;
    }
    if (this.observatory) {
      this.syncMotion();
    } else if (!this.nearViewport) {
      if (this.pending) this.teardownEnhancement();
      this.setState("static");
    } else if (
      !this.pending &&
      this.visual &&
      this.visual.clientWidth > 0 &&
      this.visual.clientHeight > 0
    ) {
      void this.enhance();
    }
  };

  private colors() {
    const styles = getComputedStyle(this);
    return {
      background: styles.getPropertyValue("--paper").trim(),
      surface: styles.getPropertyValue("--paper-2").trim(),
      accent: styles.getPropertyValue("--mark").trim(),
      evidence: styles.getPropertyValue("--evidence").trim(),
    };
  }

  private current(generation: number) {
    return (
      generation === this.generation &&
      this.isConnected &&
      this.lifecycle !== null &&
      this.eligible() &&
      !this.unavailable
    );
  }

  private async enhance() {
    const generation = ++this.generation;
    this.pending = true;
    this.setState("loading");
    try {
      // Eligibility must gate downloading Three.js, not only constructing its renderer.
      const { createObservatory } = await import("./observatory-renderer");
      if (!this.current(generation) || !this.nearViewport || !this.visual) return;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.tabIndex = -1;
      canvas.style.visibility = "hidden";
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(this.visual.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(this.visual.clientHeight * dpr));
      canvas.addEventListener("webglcontextlost", this.onContextLost);
      this.canvas = canvas;
      this.visual.append(canvas);
      const scene = await createObservatory(canvas, this.projects, this.colors());
      if (!this.current(generation) || this.canvas !== canvas) {
        scene.dispose();
        return;
      }
      this.observatory = scene;
      this.pending = false;
      scene.resize(
        this.visual.clientWidth,
        this.visual.clientHeight,
        Math.min(window.devicePixelRatio || 1, 1.5),
      );
      scene.setTheme(this.colors());
      this.focused = this.projectId(document.activeElement);
      scene.highlight(this.focused ?? this.hovered);
      scene.setScroll(this.scrollProgress());
      canvas.style.visibility = "";
      if (this.fallback) this.fallback.style.visibility = "hidden";
      if (this.pauseButton) this.pauseButton.hidden = false;
      this.syncMotion();
    } catch {
      if (generation === this.generation) this.fail();
    } finally {
      if (generation === this.generation) this.pending = false;
    }
  }

  private teardownEnhancement() {
    ++this.generation;
    this.pending = false;
    const scene = this.observatory;
    this.observatory = null;
    this.canvas?.removeEventListener("webglcontextlost", this.onContextLost);
    try {
      try {
        scene?.stop();
      } finally {
        scene?.dispose();
      }
    } catch {
      this.unavailable = true;
    }
    this.canvas?.remove();
    this.canvas = null;
    if (this.fallback) this.fallback.style.visibility = "";
    if (this.pauseButton) this.pauseButton.hidden = true;
  }

  private fail() {
    this.unavailable = true;
    this.teardownEnhancement();
    this.setState("unavailable");
  }

  private readonly onContextLost = (event: Event) => {
    event.preventDefault();
    this.fail();
  };

  private withObservatory(action: (scene: Observatory) => void) {
    if (!this.observatory) return;
    try {
      action(this.observatory);
    } catch {
      this.fail();
    }
  }

  private setState(state: SceneState) {
    this.dataset.sceneState = state;
    if (this.status)
      this.status.textContent =
        this.dataset[`status${state[0].toUpperCase()}${state.slice(1)}`] ?? "";
    if (this.pauseButton) {
      this.pauseButton.setAttribute("aria-pressed", String(this.userPaused));
      this.pauseButton.textContent =
        (this.userPaused
          ? this.pauseButton.dataset.resumeLabel
          : this.pauseButton.dataset.pauseLabel) ?? "";
    }
  }

  private readonly syncMotion = () => {
    this.withObservatory((scene) => {
      if (this.inViewport && !document.hidden && !this.userPaused) {
        scene.setScroll(this.scrollProgress());
        scene.start();
      } else {
        scene.stop();
      }
      this.setState(this.userPaused ? "paused" : "ready");
    });
  };

  private readonly onPause = () => {
    if (!this.observatory) return;
    this.userPaused = !this.userPaused;
    this.syncMotion();
  };

  private readonly onResize = () => {
    this.withObservatory((scene) => {
      if (!this.visual) return;
      scene.resize(
        this.visual.clientWidth,
        this.visual.clientHeight,
        Math.min(window.devicePixelRatio || 1, 1.5),
      );
    });
    this.reconcile();
  };

  private scrollProgress() {
    const rect = this.hero?.getBoundingClientRect();
    return rect ? Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height))) : 0;
  }

  private readonly onScroll = () => {
    if (this.inViewport && !document.hidden) {
      this.withObservatory((scene) => scene.setScroll(this.scrollProgress()));
    }
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    if (!this.observatory || !this.visual) return;
    const rect = this.visual.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1),
    );
    this.withObservatory((scene) => scene.setPointer(x, y));
  };

  private readonly onPointerLeave = () => {
    this.withObservatory((scene) => scene.setPointer(0, 0));
  };

  private projectId(target: EventTarget | null) {
    if (!(target instanceof Element)) return null;
    const link = target.closest<HTMLAnchorElement>("a[data-project-id]");
    return link ? (this.projectIds.get(link) ?? null) : null;
  }

  private highlight() {
    this.withObservatory((scene) => scene.highlight(this.focused ?? this.hovered));
  }

  private readonly onPointerOver = (event: PointerEvent) => {
    this.hovered = this.projectId(event.target);
    this.highlight();
  };

  private readonly onPointerOut = (event: PointerEvent) => {
    this.hovered = this.projectId(event.relatedTarget);
    this.highlight();
  };

  private readonly onFocusIn = (event: FocusEvent) => {
    this.focused = this.projectId(event.target);
    this.highlight();
  };

  private readonly onFocusOut = (event: FocusEvent) => {
    this.focused = this.projectId(event.relatedTarget);
    this.highlight();
  };
}

if (!customElements.get("systems-observatory")) {
  customElements.define("systems-observatory", SystemsObservatory);
}
