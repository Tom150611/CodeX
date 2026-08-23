const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

const slider = document.querySelector("[data-slider]");

if (slider) {
  const slides = [...slider.querySelectorAll(".slide")];
  const dotsWrap = slider.querySelector(".slider-dots");
  const prev = slider.querySelector(".slider-nav.prev");
  const next = slider.querySelector(".slider-nav.next");
  let index = 0;
  let timer;
  let startX = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ảnh ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsWrap.append(dot);
  });

  const dots = [...dotsWrap.querySelectorAll("button")];

  function go(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      let pos = i - index;
      const half = Math.floor(slides.length / 2);
      if (pos > half) pos -= slides.length;
      if (pos < -half) pos += slides.length;
      slide.dataset.pos = String(pos);
    });
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  function play() {
    stop();
    timer = window.setInterval(() => go(index + 1), 3800);
  }

  function stop() {
    window.clearInterval(timer);
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);

  slider.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });

  slider.addEventListener("pointerup", (event) => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 40) return;
    go(index + (delta < 0 ? 1 : -1));
  });

  go(0);
  play();
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    io.observe(item);
  });
}

const hero = document.querySelector(".hero-stage");
const heroCopy = document.querySelector(".hero-copy");

if (hero && heroCopy && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroCopy.style.transform = `translate3d(${x * 16}px, ${y * 10}px, 0)`;
  });
  hero.addEventListener("pointerleave", () => {
    heroCopy.style.transform = "";
  });
}
