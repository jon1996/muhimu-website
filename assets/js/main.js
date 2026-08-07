const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const feedback = document.querySelector("[data-form-feedback]");
const isEnglish = document.documentElement.lang === "en";

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

if (menuToggle && header && nav) {
  menuToggle.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", isEnglish ? "Open menu" : "Ouvrir le menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? (isEnglish ? "Close menu" : "Fermer le menu") : (isEnglish ? "Open menu" : "Ouvrir le menu"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

// The static form is ready to be replaced by a fetch() call to a backend endpoint.
if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = isEnglish
      ? "Thank you. Your message is ready to be connected to the future Muhimu Technologie backend."
      : "Merci. Votre message est prêt à être connecté au futur backend Muhimu Technologie.";
    contactForm.reset();
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const heroCanvas = document.querySelector("[data-hero-3d]");

if (heroCanvas) {
  const context = heroCanvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const points = [];
  const pointCount = window.innerWidth < 700 ? 46 : 72;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let pixelRatio = 1;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  for (let index = 0; index < pointCount; index += 1) {
    const phi = Math.acos(1 - (2 * (index + 0.5)) / pointCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;
    points.push({
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.cos(phi),
      z: Math.sin(theta) * Math.sin(phi),
      size: index % 9 === 0 ? 2.7 : 1.45,
    });
  }

  const resizeHeroCanvas = () => {
    const bounds = heroCanvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = Math.max(1, Math.round(bounds.width));
    canvasHeight = Math.max(1, Math.round(bounds.height));
    heroCanvas.width = Math.round(canvasWidth * pixelRatio);
    heroCanvas.height = Math.round(canvasHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const projectPoint = (point, angleY, angleX) => {
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const y1 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;
    const perspective = 2.9 / (3.6 - z2);
    const radius = Math.min(canvasWidth, canvasHeight) * 0.41;
    return {
      x: canvasWidth * 0.54 + x1 * radius * perspective,
      y: canvasHeight * 0.49 + y1 * radius * perspective,
      z: z2,
      scale: perspective,
      size: point.size,
    };
  };

  const drawHeroScene = (time = 0) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const motion = reduceMotion ? 0 : time * 0.00016;
    const projected = points.map((point) =>
      projectPoint(point, motion + pointerX * 0.18, -0.18 + pointerY * 0.12)
    );

    context.lineWidth = 0.7;
    for (let first = 0; first < projected.length; first += 1) {
      for (let second = first + 1; second < projected.length; second += 1) {
        const a = projected[first];
        const b = projected[second];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 88) {
          const alpha = (1 - distance / 88) * 0.34;
          context.strokeStyle = `rgba(73, 156, 255, ${alpha})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    projected.sort((a, b) => a.z - b.z).forEach((point) => {
      const alpha = Math.max(0.36, Math.min(1, 0.58 + point.z * 0.25));
      const radius = point.size * point.scale * 1.35;
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();

      if (point.size > 2) {
        context.strokeStyle = `rgba(10, 102, 255, ${alpha * 0.75})`;
        context.lineWidth = 5;
        context.beginPath();
        context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2);
        context.stroke();
      }

    });

    if (!reduceMotion) frame = window.requestAnimationFrame(drawHeroScene);
  };

  heroCanvas.closest(".hero").addEventListener("pointermove", (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  window.addEventListener("resize", resizeHeroCanvas, { passive: true });
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true });
  resizeHeroCanvas();
  drawHeroScene();
}

const erpDashboard = document.querySelector("[data-erp-dashboard]");

if (erpDashboard && window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)").matches) {
  const updateDashboardTilt = (event) => {
    const bounds = erpDashboard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    erpDashboard.style.setProperty("--dashboard-rotate-x", `${(0.5 - y) * 8}deg`);
    erpDashboard.style.setProperty("--dashboard-rotate-y", `${(x - 0.5) * 10}deg`);
    erpDashboard.style.setProperty("--dashboard-light-x", `${x * 100}%`);
    erpDashboard.style.setProperty("--dashboard-light-y", `${y * 100}%`);
  };

  erpDashboard.addEventListener("pointermove", updateDashboardTilt, { passive: true });
  erpDashboard.addEventListener("pointerleave", () => {
    erpDashboard.style.setProperty("--dashboard-rotate-x", "0deg");
    erpDashboard.style.setProperty("--dashboard-rotate-y", "0deg");
    erpDashboard.style.setProperty("--dashboard-light-x", "55%");
    erpDashboard.style.setProperty("--dashboard-light-y", "35%");
  });
}
