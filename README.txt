VILLA CHANDRABHAGA — SRIVAAS REALTY
====================================

FILES IN THIS FOLDER
  index.html, styles.css, script.js  — the site (open with Live Server)
  lib/                               — GSAP + Lenis bundled locally (do not
                                       delete; the site needs NO internet)
  logo.png, plan.jpg                 — already included

ASSETS YOU NEED TO ADD (exact names, same folder)
  hero.mp4          cinematic exterior hero film (autoplays, loops)
  showcase.mp4      full-villa cinematic film (grows to fullscreen)
  walkthrough.mp4   the scrub film — scroll drives this video.
                    Up to ~120s is fine; the scroll distance now adapts
                    automatically to the film's real length.
  video1.mp4 ... video10.mp4   the ten floor-by-floor films.
                    Any length 18–60s is fine — they loop on their own.
  img1.jpg ... img12.jpg       gallery wall images
  ambient.mp3       soft piano loop (starts on first click/scroll)

VIDEO FORMAT — THIS IS THE #1 REASON VIDEOS DON'T PLAY
  Every video MUST be H.264 MP4 with yuv420p pixel format.
  D5 Render / Twinmotion often export HEVC (H.265) or ProRes —
  Chrome will NOT play those; you get a black screen.
  Convert every video with:

  ffmpeg -i input.mp4 -an -vf "scale=1920:-2" -c:v libx264 \
         -pix_fmt yuv420p -crf 22 -movflags +faststart output.mp4

THE SCRUB FILM (walkthrough.mp4) NEEDS ONE EXTRA FLAG
  Scrubbing needs dense keyframes. For a 120s film, a keyframe every
  2 frames keeps the file size manageable AND the scrub smooth:

  ffmpeg -i input.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 \
         -g 2 -keyint_min 2 -pix_fmt yuv420p -crf 23 \
         -movflags +faststart walkthrough.mp4

  The page now shows a gold "PREPARING THE WALKTHROUGH — XX%" bar
  while the film buffers, and the first frame appears immediately.

DIAGNOSTICS
  If anything fails, a red box appears bottom-left naming the exact
  file and the reason (missing vs wrong codec). Missing films show a
  styled placeholder card instead of a black hole.

EDITING CONTENT (no coding needed)
  - Chapter titles/timings: CHAPTERS array, top of script.js.
    `at` is the point in the film (0–1) where each chapter starts.
  - Isometric map zones + text: ZONES array, top of script.js.
  - Film titles: index.html (search "film-card").
  - Stats numbers: data-count attributes in index.html.
