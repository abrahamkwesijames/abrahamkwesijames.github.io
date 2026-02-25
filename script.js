// Portfolio interactions & enhancements
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const galleryGrid = document.querySelector("[data-gallery-grid]");
  const galleryControls = document.querySelectorAll("[data-gallery-control]");
  const skillTracks = document.querySelectorAll(".skill-track");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const projectSubmissionForm = document.getElementById("projectSubmissionForm");
  const projectFormStatus = document.getElementById("projectFormStatus");
  const yearEl = document.getElementById("year");

  /* ---------- Helpers ---------- */
  const setThemeIcon = (mode) => {
    if (!themeIcon) return;
    themeIcon.textContent = mode === "light" ? "☀" : "☾";
  };

  const applyTheme = (mode) => {
    body.classList.toggle("light-mode", mode === "light");
    localStorage.setItem("akj-theme", mode);
    setThemeIcon(mode);
  };

  const initTheme = () => {
    const saved = localStorage.getItem("akj-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const mode = saved || (prefersLight ? "light" : "dark");
    applyTheme(mode);
  };

  /* ---------- Navigation highlighting ---------- */
  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          setActiveNav(id);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Ensure gallery section is visible on mobile after a short delay if intersection observer hasn't triggered
  const gallerySection = document.getElementById("gallery");
  if (gallerySection && window.innerWidth <= 768) {
    setTimeout(() => {
      const rect = gallerySection.getBoundingClientRect();
      const isNearViewport = rect.top < window.innerHeight + 200;
      if (isNearViewport && !gallerySection.classList.contains("visible")) {
        gallerySection.classList.add("visible");
      }
    }, 500);
  }

  /* ---------- Skill animation ---------- */
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector(".skill-fill")?.classList.add("animate");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  skillTracks.forEach((track) => skillObserver.observe(track));

  /* ---------- Mobile navigation ---------- */
  menuToggle?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  mobileMenu
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => mobileMenu.classList.add("hidden")));

  /* ---------- Theme toggle ---------- */
  initTheme();

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";
    applyTheme(nextTheme);
  });

  /* ---------- Gallery rotation ---------- */
  const rotateGallery = (direction) => {
    if (!galleryGrid || galleryGrid.children.length === 0) return;
    if (direction === "next") {
      galleryGrid.appendChild(galleryGrid.firstElementChild);
    } else {
      galleryGrid.insertBefore(galleryGrid.lastElementChild, galleryGrid.firstElementChild);
    }
  };

  galleryControls.forEach((btn) => {
    btn.addEventListener("click", () => {
      rotateGallery(btn.dataset.galleryControl);
    });
  });

  /* ---------- Contact form (Formspree) ---------- */
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formStatus.textContent = "Sending...";
      formStatus.style.color = "";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch("https://formspree.io/f/xpqjbzde", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          formStatus.style.color = "#4ade80";
          formStatus.textContent = "✓ Message sent! I'll get back to you shortly.";
          contactForm.reset();
        } else {
          const data = await response.json();
          const errorMsg = data.errors?.map((e) => e.message).join(", ") || "Submission failed.";
          formStatus.style.color = "#f87171";
          formStatus.textContent = errorMsg;
        }
      } catch (error) {
        formStatus.style.color = "#f87171";
        formStatus.textContent =
          "Something went wrong. Please email me directly at abrahamkwesijames@gmail.com";
      }
    });
  }

  /* ---------- Misc ---------- */
  yearEl && (yearEl.textContent = new Date().getFullYear());
  window.lucide?.createIcons();
});

