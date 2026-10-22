// =====================================================================
// Mídia gerada no Higgsfield.
// O vídeo foi recodificado com todos os quadros como keyframe (-g 1),
// o que deixa o "scrub" pelo scroll suave em qualquer navegador.
// Para hospedar você mesmo, rode scripts/baixar-midia.sh: os arquivos vão
// para assets/ e o site passa a usá-los antes do CDN.
// =====================================================================
const MEDIA = {
  video: ["assets/hero-scrub.mp4", "https://d2ol7oe51mr4n9.cloudfront.net/user_3KNCDGnVBc8BiyDkmJmsXiR5Lae/718c18ec-20e6-47af-b077-cc42e295dd51.mp4"],
  poster: ["assets/hero-start.webp", "https://d2ol7oe51mr4n9.cloudfront.net/user_3KNCDGnVBc8BiyDkmJmsXiR5Lae/3c9f542d-8d1d-47b6-9e7d-1056bcb927a3.webp"],
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("ano").textContent = new Date().getFullYear();

// ---------- Scroll-scrub do hero ----------
(function scrub() {
  const section = document.querySelector(".scrub");
  const video = document.getElementById("scrubVideo");
  const bar = document.getElementById("scrubBar");
  const hint = document.querySelector(".scrub__hint");
  const beats = [...document.querySelectorAll(".beat")];

  // pôster enquanto o vídeo carrega
  firstAvailable(MEDIA.poster).then((url) => {
    if (url) video.style.backgroundImage = `url("${url}")`;
  });

  let target = 0;   // tempo pedido pelo scroll
  let current = 0;  // tempo exibido (suavizado)
  let ready = false;

  loadVideo(video, MEDIA.video).then(() => {
    ready = true;
    video.pause();
    if (reduceMotion) video.currentTime = video.duration;
  });

  function progress() {
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    return clamp(-r.top / total, 0, 1);
  }

  const nav = document.querySelector(".nav");

  function onScroll() {
    const p = progress();
    nav.classList.toggle("is-solid", p >= 0.999);
    bar.style.width = (p * 100).toFixed(2) + "%";
    hint.style.opacity = p > 0.03 ? 0 : 1;
    beats.forEach((b) => {
      const on = p >= +b.dataset.from && p < +b.dataset.to;
      b.classList.toggle("is-active", on);
    });
    if (ready && !reduceMotion) target = p * (video.duration - 0.05);
  }

  function tick() {
    if (ready && !reduceMotion) {
      current += (target - current) * 0.12;
      if (Math.abs(video.currentTime - current) > 1 / 60 && !video.seeking) {
        video.currentTime = current;
      }
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  requestAnimationFrame(tick);
})();

// Baixa o vídeo inteiro como blob (seek instantâneo); se o CORS bloquear,
// usa a URL direto. Tenta cada fonte em ordem.
async function loadVideo(video, sources) {
  for (const src of sources) {
    if (!src || src.startsWith("__")) continue;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.status);
      video.src = URL.createObjectURL(await res.blob());
    } catch {
      if (src.startsWith("assets/")) continue; // arquivo local não existe
      video.src = src;
    }
    try {
      await new Promise((ok, fail) => {
        video.addEventListener("loadedmetadata", ok, { once: true });
        video.addEventListener("error", fail, { once: true });
      });
      return;
    } catch { /* tenta a próxima fonte */ }
  }
}

async function firstAvailable(sources) {
  for (const src of sources) {
    if (!src || src.startsWith("__")) continue;
    if (!src.startsWith("assets/")) return src;
    try { if ((await fetch(src, { method: "HEAD" })).ok) return src; } catch {}
  }
  return null;
}

// ---------- Revelar elementos ao rolar ----------
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
      e.target.style.transitionDelay = Math.min(siblings.indexOf(e.target), 5) * 70 + "ms";
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();
