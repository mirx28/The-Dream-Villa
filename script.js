// =====================================================================
// Villa Chandrabhaga — Srivaas Realty · Rishikesh, Uttarakhand
// UMD CDN globals (gsap, ScrollTrigger, SplitText, Lenis). No imports.
//
// REQUIRED ASSETS (same folder):
//   logo.png            — Srivaas logo (dark version)
//   hero.mp4            — your cinematic exterior hero film
//   showcase.mp4        — full-villa cinematic walkthrough (autoplays)
//   walkthrough.mp4     — 60–90s scrub cut (MUST be keyframe-encoded, see below)
//   video1.mp4 … video10.mp4 — the ten floor-by-floor films
//   img1.jpg … img12.jpg     — gallery wall
//   plan.jpg            — ground floor plan
//   ambient.mp3         — soft piano loop
//
// FFMPEG — encode the scrub video with a keyframe on EVERY frame so
// scrolling backwards/forwards is butter smooth (file gets bigger, worth it):
//   ffmpeg -i input.mp4 -an -vf "scale=1920:-2" -c:v libx264 -g 1 \
//          -keyint_min 1 -pix_fmt yuv420p -crf 21 -movflags +faststart \
//          walkthrough.mp4
// =====================================================================

// ---- On-page diagnostics (no console needed) ----
function showMsg(text) {
  let box = document.querySelector(".error-box");
  if (!box) {
    box = document.createElement("div");
    box.className = "error-box";
    box.style.cssText =
      "position:fixed;bottom:1rem;left:1rem;z-index:99999;background:#a4452f;color:#fff;" +
      "padding:.75rem 1rem;border-radius:8px;font:12px/1.5 monospace;max-width:70ch;white-space:pre-wrap;";
    document.body.appendChild(box);
  }
  box.textContent += (box.textContent ? "\n" : "") + text;
}

window.addEventListener("error", (e) => {
  if (e.message) showMsg("Error: " + e.message + " (" + (e.filename || "") + ":" + e.lineno + ")");
});
window.addEventListener("unhandledrejection", (e) => {
  showMsg("Async error: " + (e.reason && e.reason.message ? e.reason.message : e.reason));
});

// ---- Preloader failsafe: never leave the visitor stuck ----
let preloaderDone = false;
function killPreloader() {
  if (preloaderDone) return;
  preloaderDone = true;
  const p = document.querySelector(".preloader");
  if (p) p.style.display = "none";
  document.querySelectorAll(".nav, .audio-toggle").forEach((el) => (el.style.opacity = 1));
  document
    .querySelectorAll(".hero-title .line-in, .hero-eyebrow, .hero-sub, .hero-foot")
    .forEach((el) => {
      el.style.transform = "none";
      el.style.opacity = 1;
    });
}
setTimeout(() => {
  if (!preloaderDone) {
    killPreloader();
    showMsg("Failsafe: intro skipped because something blocked it — see messages above.");
  }
}, 12000);

if (window.gsap) {
  const plugins = [window.ScrollTrigger, window.SplitText].filter(Boolean);
  if (plugins.length) gsap.registerPlugin(...plugins);
}

// =====================================================================
// EDITABLE DATA — change text here, no need to touch the logic below
// =====================================================================

// Chapters for the scroll-scrubbed walkthrough.
// `sec` = the moment in the film (in SECONDS) where the chapter begins.
// Edit these numbers any time — they map directly to your video timeline.
const CHAPTERS = [
  { sec: 0,  title: "The Arrival",            dim: "GUEST & STAFF ENTRY \u00B7 ACCESS ROAD" },
  { sec: 4,  title: "The Motor Court",        dim: "PRIVATE PARKING \u00B7 TREE-LINED APPROACH" },
  { sec: 11, title: "The Courtyard Villa",    dim: "RESIDENCE ONE \u00B7 STONE & GLASS" },
  { sec: 26, title: "The Garden Villa",       dim: "RESIDENCE TWO \u00B7 LAWN ASPECT" },
  { sec: 40, title: "The Hillside Villa",     dim: "RESIDENCE THREE \u00B7 VALLEY VIEWS" },
  { sec: 55, title: "Lawns, Pool & Play",     dim: "SWIMMING POOL \u00B7 KIDS POOL \u00B7 PLAY AREA" },
  { sec: 69, title: "The Barbeque Court",     dim: "BARBEQUE COUNTER \u00B7 ALFRESCO DINING" },
  { sec: 75, title: "Villa Chandrabhaga",     dim: "THE MAIN RESIDENCE" },
  { sec: 81, title: "Sports & Leisure Lawns", dim: "SPORTS AMENITIES \u00B7 BARBEQUE \u00B7 LAWNS" },
  { sec: 87, title: "Welcome To Your Future", dim: "VILLA CHANDRABHAGA \u00B7 RISHIKESH, UTTARAKHAND" },
];

// Zones for the interactive isometric estate model.
// Units are plan-units (the plot is roughly 104 × 70). Each zone is a
// stack of boxes: { x, y, w, d, h, z (base height), c (color set) }.
const C = {
  stone:  { top: "#e9e5dc", left: "#c6c0b2", right: "#b2ab9c" },
  white:  { top: "#f5f2ea", left: "#d4cec0", right: "#bfb8a8" },
  dark:   { top: "#a9a294", left: "#8c8678", right: "#7a7467" },
  water:  { top: "#7cc3d9", left: "#5da9c2", right: "#4f97af" },
  grass:  { top: "#a3cc8a", left: "#86b06e", right: "#74995e" },
  hill:   { top: "#8fbf76", left: "#74a35d", right: "#638c4f" },
  hill2:  { top: "#7dab66", left: "#66904f", right: "#567a42" },
  deck:   { top: "#ddd6c8", left: "#bcb4a3", right: "#a89f8e" },
  sage:   { top: "#b6c4a8", left: "#99a78c", right: "#879478" },
};

const ZONES = [
  {
    id: "motorcourt", chip: "Arrival", no: "Zone 01 \u2014 The Approach",
    name: "Arrival & Motor Court", dim: "GUEST & STAFF ENTRY \u00B7 PRIVATE PARKING",
    text: "The drive winds in from the eastern corner \u2014 a brick-lined walkway, private parking and the entrance to the main residence.",
    video: "./walkthrough.mp4",
    boxes: [
      { x: 54, y: 56, w: 48, d: 6, h: 0.5, z: 0, c: C.dark },
      { x: 54, y: 62.5, w: 48, d: 1.8, h: 0.3, z: 0, c: C.deck },
      { x: 84, y: 57.5, w: 4.5, d: 2.6, h: 1.5, z: 0.5, c: C.white },
      { x: 90, y: 57.5, w: 4.5, d: 2.6, h: 1.5, z: 0.5, c: C.stone },
      { x: 96, y: 57.5, w: 4.5, d: 2.6, h: 1.5, z: 0.5, c: C.white },
    ],
  },
  {
    id: "mainvilla", chip: "Main Villa", no: "Zone 02 \u2014 The Main Residence",
    name: "Villa Chandrabhaga", dim: "LOUNGE & DINING \u00B7 KITCHEN \u00B7 SUITES",
    text: "The principal residence \u2014 a courtyard composition of living spaces, the wood-fired kitchen and bedroom suites, wrapped around the pool garden.",
    video: "./video4.mp4",
    boxes: [
      { x: 58, y: 8, w: 12, d: 26, h: 13, z: 0, c: C.white },
      { x: 58, y: 8, w: 12, d: 26, h: 1, z: 13, c: C.stone },
      { x: 60, y: 38, w: 13, d: 10, h: 8, z: 0, c: C.white },
      { x: 86, y: 36, w: 12, d: 10, h: 7, z: 0, c: C.stone },
    ],
  },
  {
    id: "pool", chip: "Pool", no: "Zone 03 \u2014 The Pool Garden",
    name: "The Swimming Pool", dim: "34'-2\" \u00D7 15'-0\" \u00B7 COURTYARD POOL",
    text: "Set inside the courtyard of the main residence \u2014 the pool garden, sheltered by the buildings around it.",
    video: "./video6.mp4",
    boxes: [
      { x: 74, y: 16, w: 16, d: 16, h: 1, z: 0, c: C.deck },
      { x: 77, y: 18, w: 9, d: 11, h: 0.8, z: 1, c: C.water },
    ],
  },
  {
    id: "courtyard", chip: "Courtyard Villa", no: "Zone 04 \u2014 Residence One",
    name: "The Courtyard Villa", dim: "STONE & GLASS \u00B7 THREE FLOORS",
    text: "Residence One \u2014 the highest of the three hillside villas, beside the stepping-stone path.",
    video: "./video1.mp4",
    boxes: [
      { x: 6, y: 4, w: 13, d: 11, h: 9, z: 0, c: C.white },
      { x: 6, y: 4, w: 13, d: 11, h: 0.8, z: 9, c: C.stone },
    ],
  },
  {
    id: "garden", chip: "Garden Villa", no: "Zone 05 \u2014 Residence Two",
    name: "The Garden Villa", dim: "LAWN ASPECT \u00B7 PRIVATE TERRACES",
    text: "Residence Two \u2014 the middle villa of the cluster, opening onto the central lawn.",
    video: "./video9.mp4",
    boxes: [
      { x: 15, y: 14, w: 13, d: 11, h: 8, z: 0, c: C.stone },
      { x: 15, y: 14, w: 13, d: 11, h: 0.8, z: 8, c: C.white },
    ],
  },
  {
    id: "hillside", chip: "Hillside Villa", no: "Zone 06 \u2014 Residence Three",
    name: "The Hillside Villa", dim: "VALLEY VIEWS \u00B7 ROOF TERRACE",
    text: "Residence Three \u2014 the lowest of the cluster, set against the slope with views down the valley.",
    video: "./video8.mp4",
    boxes: [
      { x: 7, y: 23, w: 13, d: 11, h: 8.5, z: 0, c: C.white },
      { x: 7, y: 23, w: 13, d: 11, h: 0.8, z: 8.5, c: C.stone },
    ],
  },
  {
    id: "amenities", chip: "Spa & Barbeque", no: "Zone 07 \u2014 Leisure Wing",
    name: "Barbeque, Spa & Gym", dim: "SPA \u00B7 GYM \u00B7 BARBEQUE PAVILION",
    text: "The green-roofed spa and gym pavilions at the rear of the complex, with the barbeque pavilion at its front corner.",
    video: "./video7.mp4",
    boxes: [
      { x: 74, y: 4, w: 11, d: 12, h: 6, z: 0, c: C.stone },
      { x: 74, y: 4, w: 11, d: 12, h: 1, z: 6, c: C.sage },
      { x: 87, y: 4, w: 12, d: 12, h: 6, z: 0, c: C.stone },
      { x: 87, y: 4, w: 12, d: 12, h: 1, z: 6, c: C.sage },
      { x: 90, y: 47, w: 8, d: 7, h: 4, z: 0, c: C.dark },
    ],
  },
  {
    id: "lawns", chip: "Lawns", no: "Zone 08 \u2014 The Grounds",
    name: "Lawns & Pathways", dim: "LUSH LAWNS \u00B7 POND \u00B7 PATHWAYS",
    text: "The open heart of the estate \u2014 the great lawn between the villas and the main residence, with its pond and winding stone paths.",
    video: "./video10.mp4",
    boxes: [
      { x: 30, y: 6, w: 20, d: 42, h: 0.8, z: 0, c: C.grass },
      { x: 42, y: 10, w: 6, d: 4, h: 0.6, z: 0.8, c: C.water },
    ],
  },
];

// =====================================================================
// MAIN
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
  // ---- Boot check: report exactly which library failed to load ----
  const missing = [];
  if (!window.gsap) missing.push("gsap.min.js");
  if (!window.ScrollTrigger) missing.push("ScrollTrigger.min.js");
  if (!window.SplitText) missing.push("SplitText.min.js");
  if (!window.Lenis) missing.push("lenis.min.js (smooth scroll)");
  if (missing.length) {
    showMsg(
      "These libraries did not load:\n  - " + missing.join("\n  - ") +
      "\nCheck your internet connection and disable ad-blockers for cdn.jsdelivr.net, then refresh.",
    );
  }
  if (window.__failedResources && window.__failedResources.length) {
    showMsg("Files that failed to load:\n  - " + window.__failedResources.join("\n  - "));
  }
  if (!window.gsap || !window.ScrollTrigger) {
    // Can't animate at all — show the page plainly instead of a dead screen.
    killPreloader();
    return;
  }

  try {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Smooth scroll (optional — site works natively without it) ----
  let lenis = null;
  if (window.Lenis) {
   lenis = new Lenis({ duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // locked until the preloader finishes
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0 });
        else target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---- Per-video diagnostics: name the file AND the reason ----
  document.querySelectorAll("video").forEach((v) => {
    v.addEventListener("error", () => {
      const name = (v.currentSrc || v.getAttribute("src") || "video").split("/").pop();
      const code = v.error ? v.error.code : 0;
      let why = "could not be loaded — check the file exists with this exact name.";
      if (code === 4) why = "exists but the browser can't play it. Re-export as H.264 MP4 (yuv420p). HEVC/H.265 from D5/Twinmotion will NOT play in Chrome.";
      else if (code === 3) why = "is corrupted or uses an unsupported codec. Re-export as H.264 MP4 (yuv420p).";
      else if (code === 2) why = "failed due to a network error — try refreshing.";
      showMsg("\u25B6 " + name + " " + why);
    });
  });

  // ===================================================================
  // PRELOADER — gold line + counter, then reveal
  // ===================================================================
  const counter = { v: 0 };
  const countEl = document.querySelector(".preloader-count");

  // Wrap hero title lines for the masked reveal
  document.querySelectorAll(".hero-title .line").forEach((line) => {
    line.innerHTML = `<span class="line-in" style="display:block">${line.innerHTML}</span>`;
  });
  gsap.set(".hero-title .line-in", { yPercent: 110 });
  gsap.set(".hero-eyebrow, .hero-sub, .hero-foot", { opacity: 0, y: 20 });

  const preloadTl = gsap.timeline({
    onComplete: () => {
      preloaderDone = true;
      if (lenis) lenis.start();
    },
  });

  preloadTl
    .to(counter, {
      v: 100,
      duration: reduceMotion ? 0.3 : 2.2,
      ease: "power2.inOut",
      onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(2, "0")),
    })
    .to(".preloader-line span", { scaleX: 1, duration: reduceMotion ? 0.3 : 2.2, ease: "power2.inOut" }, 0)
    .to(".preloader-inner", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, "+=0.2")
    .to(".preloader", { yPercent: -100, duration: 1, ease: "power4.inOut" })
    .set(".preloader", { display: "none" })
    .call(() => (preloaderDone = true))
    .to(".hero-title .line-in", { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" }, "-=0.55")
    .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.9")
    .to(".hero-sub, .hero-foot", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.7")
    .to(".nav, .audio-toggle", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");

  // ===================================================================
  // AMBIENT AUDIO — starts on first interaction, toggle to mute
  // ===================================================================
  const ambient = document.querySelector(".ambient");
  const audioBtn = document.querySelector(".audio-toggle");
  ambient.volume = 0.35;
  let audioStarted = false;

  function startAudio() {
    if (audioStarted) return;
    audioStarted = true;
    ambient.play().then(() => audioBtn.classList.add("playing")).catch(() => {});
  }
  window.addEventListener("pointerdown", startAudio, { once: true });
  window.addEventListener("wheel", startAudio, { once: true, passive: true });
  window.addEventListener("touchstart", startAudio, { once: true });

  audioBtn.addEventListener("click", () => {
    audioStarted = true;
    if (ambient.paused) {
      ambient.play().then(() => audioBtn.classList.add("playing")).catch(() => {});
    } else {
      ambient.pause();
      audioBtn.classList.remove("playing");
    }
  });

  // ===================================================================
  // HERO — gentle parallax out
  // ===================================================================
  gsap.to(".hero-media", {
    yPercent: 14,
    scale: 1.06,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-content", {
    opacity: 0,
    y: -60,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true },
  });

  // ===================================================================
  // STORY — words ignite as you scroll
  // ===================================================================
  if (window.SplitText) {
    const storySplit = SplitText.create(".story-text", { type: "words", wordsClass: "word" });
    gsap.timeline({
      scrollTrigger: {
        trigger: ".story",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: ".story-pin",
      },
    })
      .to(storySplit.words, { opacity: 1, stagger: 0.06, ease: "none" })
      .from(".story-note", { opacity: 0, y: 16, ease: "none" }, "<60%");
  } else {
    gsap.set(".story-text", { opacity: 1 });
    gsap.timeline({
      scrollTrigger: {
        trigger: ".story",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: ".story-pin",
      },
    })
      .from(".story-text", { opacity: 0.1, ease: "none" })
      .from(".story-note", { opacity: 0, y: 16, ease: "none" }, "<60%");
  }

  // ===================================================================
  // SHOWCASE — film grows from a card to fullscreen
  // ===================================================================
  const showcaseVideo = document.querySelector(".showcase-frame video");

  gsap.timeline({
    scrollTrigger: {
      trigger: ".showcase",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      pin: ".showcase-pin",
    },
  })
    .to(".showcase-frame", { width: "100vw", height: "100svh", borderRadius: 0, ease: "none", duration: 0.6 })
    .to(".showcase-caption", { opacity: 1, ease: "none", duration: 0.25 }, 0.55);

  ScrollTrigger.create({
    trigger: ".showcase",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => showcaseVideo.play().catch(() => {}),
    onEnterBack: () => showcaseVideo.play().catch(() => {}),
    onLeave: () => showcaseVideo.pause(),
    onLeaveBack: () => showcaseVideo.pause(),
  });

  // ===================================================================
  // SCRUBBED WALKTHROUGH — scroll drives the camera
  // ===================================================================
  const scrubVideo = document.querySelector(".scrub-video");
  const chaptersWrap = document.querySelector(".scrub-chapters");
  const progressFill = document.querySelector(".scrub-progress-fill");
  const progressLabel = document.querySelector(".scrub-progress-label");

  // Build chapter elements from the CHAPTERS array
  const chapterEls = CHAPTERS.map((ch) => {
    const el = document.createElement("div");
    el.className = "scrub-chapter";
    el.innerHTML = `<h3>${ch.title}</h3><p>${ch.dim}</p>`;
    chaptersWrap.appendChild(el);
    return el;
  });

  let scrubTarget = 0;   // where the scroll wants the video to be (0–1)
  let scrubCurrent = 0;  // smoothed playhead
  let activeChapter = -1;
  let introHidden = false;
  let scrubReady = false;

  const loadingEl = document.querySelector(".scrub-loading");
  const loadingPct = document.querySelector(".scrub-loading-pct");
  const loadingBar = document.querySelector(".scrub-loading-line span");

  // Scroll distance scales with the film's real length:
  // ~85px of scroll per second of footage, clamped to sane limits.
  // A 120s walkthrough gets ~10,200px of scroll — room to breathe.
  function getScrubDistance() {
    const d = scrubVideo.duration && isFinite(scrubVideo.duration) ? scrubVideo.duration : 90;
    return Math.round(Math.min(16000, Math.max(3500, d * 85)));
  }

  ScrollTrigger.create({
    trigger: ".scrub",
    start: "top top",
    end: () => "+=" + getScrubDistance(),
    pin: ".scrub-pin",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      scrubTarget = self.progress;
      progressFill.style.transform = `scaleX(${self.progress})`;

      // Intro fades once the journey starts
      if (self.progress > 0.03 && !introHidden) {
        introHidden = true;
        gsap.to(".scrub-intro", { opacity: 0, y: -30, duration: 0.5, ease: "power2.out" });
      } else if (self.progress <= 0.03 && introHidden) {
        introHidden = false;
        gsap.to(".scrub-intro", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      }

      // Chapter switching — driven by the actual second in the film
      const dur = scrubVideo.duration && isFinite(scrubVideo.duration) ? scrubVideo.duration : 0;
      if (dur) {
        const t = self.progress * dur;
        let idx = 0;
        for (let i = 0; i < CHAPTERS.length; i++) {
          if (t >= CHAPTERS[i].sec) idx = i;
        }
        if (self.progress < 0.015) idx = -1; // nothing before the journey starts
       if (idx !== activeChapter) {
          // Kill ALL running chapter animations instantly before starting new ones
          chapterEls.forEach((el) => gsap.killTweensOf(el));

          if (activeChapter >= 0) {
            gsap.set(chapterEls[activeChapter], { opacity: 0, y: -18 });
          }
          if (idx >= 0) {
            gsap.fromTo(
              chapterEls[idx],
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
            );
            progressLabel.textContent = `CHAPTER ${String(idx + 1).padStart(2, "0")} / ${String(CHAPTERS.length).padStart(2, "0")} \u2014 ${CHAPTERS[idx].title.toUpperCase()}`;
          }
          activeChapter = idx;
        }
      }
    },
  });

  // Smooth the playhead toward the scroll target every tick.
  // Lerping (instead of setting currentTime directly) is what makes
  // the scrub feel cinematic instead of stuttery.
  gsap.ticker.add(() => {
    if (!scrubVideo.duration || scrubVideo.readyState < 2) return;
       const diff = scrubTarget - scrubCurrent;
    const absDiff = Math.abs(diff);

    // If the user scrolled a big chunk — snap instantly, no lerp
    if (absDiff > 0.08) {
      scrubCurrent = scrubTarget;
    } else {
      // Small movement — lerp smoothly
      scrubCurrent += diff * 0.12;
    }

    const t = scrubCurrent * scrubVideo.duration;
    const gap = Math.abs(scrubVideo.currentTime - t);

    // Only write to currentTime if it's actually moved enough to matter
    if (gap > 0.016) {
      scrubVideo.currentTime = t;
    }
  });

  // --- Buffering feedback: show how much of the film has arrived ---
  function updateScrubBuffer() {
    if (!scrubVideo.duration || !scrubVideo.buffered.length) return;
    const buffered = scrubVideo.buffered.end(scrubVideo.buffered.length - 1) / scrubVideo.duration;
    const pct = Math.min(100, Math.round(buffered * 100));
    loadingPct.textContent = pct;
    loadingBar.style.transform = `scaleX(${pct / 100})`;
    if (pct >= 99 && !scrubReady) {
      scrubReady = true;
      gsap.to(loadingEl, { opacity: 0, duration: 0.6, onComplete: () => (loadingEl.style.display = "none") });
    }
  }
  scrubVideo.addEventListener("progress", updateScrubBuffer);
  scrubVideo.addEventListener("loadeddata", updateScrubBuffer);

  // The first frame can show as soon as ANY data exists — don't make
  // the visitor stare at black while the rest buffers.
  scrubVideo.addEventListener("loadeddata", () => {
    scrubVideo.currentTime = 0.001;
  });

  // Once we know the real duration, rebuild the scroll distance to match.
  scrubVideo.addEventListener("loadedmetadata", () => {
    ScrollTrigger.refresh();
  });

  // Start buffering the full film as soon as the page is interactive —
  // a 120s walkthrough needs the head start.
  scrubVideo.preload = "auto";
  scrubVideo.load();
  scrubVideo.playbackRate = 0;

  // ===================================================================
  // EXPLORE — generated isometric estate model
  // ===================================================================
  const ISO = { cos: Math.cos(Math.PI / 6), sin: 0.5, s: 5.4, ox: 430, oy: 120 };

  function isoPt(x, y, z) {
    return {
      X: (x - y) * ISO.cos * ISO.s + ISO.ox,
      Y: (x + y) * ISO.sin * ISO.s - z * ISO.s + ISO.oy,
    };
  }

  function poly(points, fill, extra = "") {
    const pts = points.map((p) => `${p.X.toFixed(1)},${p.Y.toFixed(1)}`).join(" ");
    return `<polygon points="${pts}" fill="${fill}" ${extra}/>`;
  }

  // Build the three visible faces of a box
  function isoBox(b) {
    const { x, y, w, d, h, z, c } = b;
    const At = isoPt(x, y, z + h), Bt = isoPt(x + w, y, z + h);
    const Ct = isoPt(x + w, y + d, z + h), Dt = isoPt(x, y + d, z + h);
    const Bb = isoPt(x + w, y, z), Cb = isoPt(x + w, y + d, z), Db = isoPt(x, y + d, z);
    return (
      poly([Dt, Ct, Cb, Db], c.left) +
      poly([Bt, Ct, Cb, Bb], c.right) +
      poly([At, Bt, Ct, Dt], c.top)
    );
  }

  function buildIsoMap() {
    let svg = `<svg viewBox="0 0 960 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive model of the Villa Chandrabhaga estate">`;

    // Hillside terraces + access road (background, not interactive)
    svg += `<g class="iso-terrain">`;
    svg += isoBox({ x: -28, y: -20, w: 156, d: 108, h: 6, z: -15, c: C.hill2 });
    svg += isoBox({ x: -16, y: -12, w: 132, d: 92, h: 6, z: -9, c: C.hill });
    svg += isoBox({ x: -2, y: -2, w: 104, d: 70, h: 3, z: -3, c: C.stone });
    svg += isoBox({ x: -2, y: -2, w: 104, d: 5, h: 0.4, z: 0, c: { top: "#b8b3a8", left: "#9c978c", right: "#8d887e" } });
    svg += `</g>`;

    // Interactive zones — every box drawn individually back-to-front so
    // disjoint pieces of a zone (e.g. the barbeque pavilion) layer correctly.
    const allBoxes = [];
    ZONES.forEach((zone) => zone.boxes.forEach((b) => allBoxes.push({ zone, b })));
    // Ground slabs (lawns, roads, decks, water) sit in a bottom layer sorted
    // by their top height; buildings sort back-to-front above them.
    const isGround = (b) => b.z + b.h <= 2;
    allBoxes.sort((p, q) => {
      const gp = isGround(p.b), gq = isGround(q.b);
      if (gp !== gq) return gp ? -1 : 1;
      if (gp) return p.b.z + p.b.h - (q.b.z + q.b.h);
      return p.b.y + p.b.d - (q.b.y + q.b.d) || p.b.z - q.b.z;
    });

    allBoxes.forEach(({ zone, b }) => {
      svg += `<g class="iso-zone" data-zone="${zone.id}"><g class="iso-lift">${isoBox(b)}</g></g>`;
    });

    // Pin markers — one per zone, above its tallest box, in a top layer
    ZONES.forEach((zone) => {
      let topMost = { X: 0, Y: Infinity };
      zone.boxes.forEach((b) => {
        const center = isoPt(b.x + b.w / 2, b.y + b.d / 2, b.z + b.h);
        if (center.Y < topMost.Y) topMost = center;
      });
      svg += `<g class="iso-node" data-zone="${zone.id}">
        <line x1="${topMost.X}" y1="${topMost.Y - 26}" x2="${topMost.X}" y2="${topMost.Y - 6}" stroke="#c39235" stroke-width="1.2"/>
        <circle cx="${topMost.X}" cy="${topMost.Y - 30}" r="4.5" fill="#e8c374" stroke="#c39235" stroke-width="1.5"/>
      </g>`;
    });

    svg += `</svg>`;
    document.querySelector(".explore-map").innerHTML = svg;
  }

  buildIsoMap();

  const cardNo = document.querySelector(".explore-card-no");
  const cardName = document.querySelector(".explore-card-name");
  const cardDim = document.querySelector(".explore-card-dim");
  const cardText = document.querySelector(".explore-card-text");
  const cardVideo = document.querySelector(".explore-card-video");
  const cardVideoWrap = document.querySelector(".explore-card-film");
  const chipsWrap = document.querySelector(".explore-chips");

  // Hide the preview frame gracefully if a clip is missing
  cardVideo.addEventListener("error", () => {
    cardVideoWrap.style.display = "none";
  });

  // Chips
  ZONES.forEach((zone) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.zone = zone.id;
    chip.textContent = zone.chip;
    chipsWrap.appendChild(chip);
  });

  function selectZone(id, animateCard = true) {
    const zone = ZONES.find((z) => z.id === id);
    if (!zone) return;

    document.querySelectorAll(".iso-zone").forEach((g) => g.classList.toggle("active", g.dataset.zone === id));
    document.querySelectorAll(".iso-node").forEach((g) => g.classList.toggle("active", g.dataset.zone === id));
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.zone === id));

    cardNo.textContent = zone.no;
    cardName.textContent = zone.name;
    cardDim.textContent = zone.dim;
    cardText.textContent = zone.text;

    // Live film preview of this part of the estate
    if (zone.video) {
      const current = cardVideo.getAttribute("src");
      if (current !== zone.video) {
        cardVideoWrap.style.display = "block";
        cardVideo.setAttribute("src", zone.video);
        cardVideo.load();
      }
      cardVideo.play().catch(() => {});
    }

    if (animateCard) {
      gsap.fromTo(".explore-card", { opacity: 0.4, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    }
  }

  document.querySelectorAll(".iso-zone").forEach((g) => {
    g.addEventListener("pointerenter", () => selectZone(g.dataset.zone));
    g.addEventListener("click", () => selectZone(g.dataset.zone));
  });
  chipsWrap.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) selectZone(chip.dataset.zone);
  });

  selectZone("mainvilla", false);

  gsap.from(".explore-stage", {
    y: 70,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".explore", start: "top 70%" },
  });

  // ===================================================================
  // STATS
  // ===================================================================
  document.querySelectorAll(".count").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(el, { innerText: 0 }, { innerText: target, duration: 1.6, snap: { innerText: 1 }, ease: "power2.out" });
      },
    });
  });

  gsap.from(".stat", {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
  });

  // ===================================================================
  // GALLERY PARALLAX
  // ===================================================================
  [
    { id: "#about-imgs-col-1", y: -500 },
    { id: "#about-imgs-col-2", y: -250 },
    { id: "#about-imgs-col-3", y: -250 },
    { id: "#about-imgs-col-4", y: -500 },
  ].forEach(({ id, y }) => {
    gsap.to(id, {
      y,
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // ===================================================================
  // FILMS — horizontal cinema reel
  // ===================================================================
  const filmsTrack = document.querySelector(".films-track");

  const getFilmsDistance = () => filmsTrack.scrollWidth - window.innerWidth + 128;

  gsap.to(filmsTrack, {
    x: () => -getFilmsDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: ".films",
      start: "top top",
      end: () => `+=${getFilmsDistance()}`,
      pin: ".films-pin",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // Play film videos only while visible (saves GPU with 10 videos)
const filmObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video");
        if (!video) return;
        if (entry.isIntersecting) {
          // Only set src and load when it comes into view
          if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 200px 0px 200px" },
  );
  document.querySelectorAll(".film-card").forEach((card) => filmObserver.observe(card));

  // If a film is missing or unplayable, show a styled placeholder
  // instead of a black hole — the reel keeps its rhythm.
  document.querySelectorAll(".film-card").forEach((card) => {
    const video = card.querySelector("video");
    const frame = card.querySelector(".film-frame");
    const no = card.querySelector(".film-no");
    if (!video || !frame) return;
    video.addEventListener("error", () => {
      const name = (video.getAttribute("src") || "").split("/").pop();
      frame.classList.add("missing");
      frame.innerHTML = `<p>FILM ${no ? no.textContent : ""} \u2014 ADD ${name.toUpperCase()}</p>`;
    });
  });

  // ===================================================================
  // PLAN / CTA reveals
  // ===================================================================
  gsap.from(".plan-frame", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".plan", start: "top 75%" },
  });

  gsap.from(".cta h2, .cta-btn, .cta .section-eyebrow", {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".cta", start: "top 80%" },
  });

  // ===================================================================
  // ENQUIRY PANEL
  // ===================================================================
  const panel = document.querySelector(".detail-panel");
  const backdrop = document.querySelector(".backdrop");
  const closeBtn = document.querySelector(".detail-close");
  const formContent = panel.querySelector(".detail-content");
  const thankyou = panel.querySelector(".detail-thankyou");
  const errorEl = panel.querySelector(".form-error");

  function openPanel() {
    formContent.style.display = "block";
    thankyou.classList.remove("show");
    errorEl.textContent = "";
    ["f-first", "f-last", "f-email", "f-phone"].forEach((cls) => (panel.querySelector("." + cls).value = ""));
    panel.classList.add("open");
    backdrop.classList.add("open");
    if (lenis) lenis.stop();
  }

  function closePanel() {
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    if (lenis) lenis.start();
  }

  document.querySelectorAll(".open-enquiry").forEach((btn) => btn.addEventListener("click", openPanel));
  closeBtn.addEventListener("click", closePanel);
  backdrop.addEventListener("click", closePanel);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  panel.querySelector(".submit-btn").addEventListener("click", () => {
    const first = panel.querySelector(".f-first").value.trim();
    const last = panel.querySelector(".f-last").value.trim();
    const email = panel.querySelector(".f-email").value.trim();
    const phone = panel.querySelector(".f-phone").value.trim();

    if (first.length < 2 || last.length < 2) {
      errorEl.textContent = "Please enter your first and last name.";
      return;
    }
    if (!email.includes("@")) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }
    if (phone.length < 6) {
      errorEl.textContent = "Please enter a valid phone number.";
      return;
    }
    formContent.style.display = "none";
    thankyou.classList.add("show");
  });

  // ===================================================================
  // Resize — refresh triggers (films distance is functional, recalcs)
  // ===================================================================
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
  window.addEventListener("load", () => ScrollTrigger.refresh());

  } catch (err) {
    showMsg("Setup error: " + err.message);
    killPreloader();
  }
});

