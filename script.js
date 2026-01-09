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

  const EMAILJS_SERVICE_ID = "service_id_here";
  const EMAILJS_TEMPLATE_ID = "template_id_here";
  const EMAILJS_PUBLIC_KEY = "public_key_here";
  
  // Project Submission Form EmailJS Configuration
  // Replace these placeholders with your actual EmailJS credentials:
  // - YOUR_PUBLIC_KEY_HERE: Get this from EmailJS Dashboard > Account > API Keys > Public Key
  // - YOUR_SERVICE_ID: Get this from EmailJS Dashboard > Email Services (create a service if needed)
  // - YOUR_TEMPLATE_ID: Get this from EmailJS Dashboard > Email Templates (create a template with fields: from_name, reply_to, project_idea)
  const PROJECT_FORM_SERVICE_ID = "service_1sr29p3";
  const PROJECT_FORM_TEMPLATE_ID = "template_k3lm0k6";
  const PROJECT_FORM_PUBLIC_KEY = "ecoXw-7bPlc0ylqFs";
  
  // Initialize EmailJS once for all forms
  // Initialize EmailJS with the public key
  let emailjsInitialized = false;
  if (window.emailjs) {
    try {
      // EmailJS v3 initialization - pass public key to init
      emailjs.init({
        publicKey: PROJECT_FORM_PUBLIC_KEY
      });
      emailjsInitialized = true;
      console.log("EmailJS initialized successfully with public key");
    } catch (error) {
      console.error("Failed to initialize EmailJS:", error);
      // Try alternative initialization method
      try {
        emailjs.init(PROJECT_FORM_PUBLIC_KEY);
        emailjsInitialized = true;
        console.log("EmailJS initialized with alternative method");
      } catch (err2) {
        console.error("Alternative initialization also failed:", err2);
      }
    }
  } else {
    console.warn("EmailJS library not loaded");
  }

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

  /* ---------- Contact form (EmailJS) ---------- */
  if (contactForm && window.emailjs) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formStatus.textContent = "Sending...";

      const formData = new FormData(contactForm);
      const templateParams = {
        from_name: formData.get("name"),
        reply_to: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        formStatus.textContent = "Message sent. I will get back to you shortly.";
        contactForm.reset();
      } catch (error) {
        console.error(error);
        formStatus.textContent =
          "Something went wrong. Please email me directly while I fix this.";
      }
    });
  } else if (contactForm) {
    formStatus.textContent = "EmailJS failed to load. Refresh to try again.";
  }

  /* ---------- Project Submission Form (EmailJS) ---------- */
  // EmailJS is initialized above for all forms
  if (projectSubmissionForm) {
    projectSubmissionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      // Check if EmailJS is available and initialized
      if (!window.emailjs || !emailjsInitialized) {
        projectFormStatus.textContent = "✗ EmailJS not loaded. Please refresh the page and try again.";
        projectFormStatus.className = "text-sm text-red-400 mt-3";
        return;
      }
      
      // Show loading state
      projectFormStatus.textContent = "Sending your project idea...";
      projectFormStatus.className = "text-sm text-white/60 mt-3";
      
      const submitButton = projectSubmissionForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Get form data
      const formData = new FormData(projectSubmissionForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const projectIdea = formData.get("projectIdea");
      
      // Validate form data
      if (!name || !email || !projectIdea) {
        projectFormStatus.textContent = "✗ Please fill in all fields.";
        projectFormStatus.className = "text-sm text-red-400 mt-3";
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
      }
      
      const templateParams = {
        from_name: name,
        reply_to: email,
        project_idea: projectIdea,
      };

      try {
        console.log("Sending email with params:", templateParams);
        console.log("Service ID:", PROJECT_FORM_SERVICE_ID);
        console.log("Template ID:", PROJECT_FORM_TEMPLATE_ID);
        
        // Send email using EmailJS
        const response = await emailjs.send(PROJECT_FORM_SERVICE_ID, PROJECT_FORM_TEMPLATE_ID, templateParams);
        console.log("EmailJS response:", response);
        
        // Success: show message and clear form
        projectFormStatus.textContent = "✓ Project idea submitted successfully! I'll review it and get back to you soon.";
        projectFormStatus.className = "text-sm text-brand-accent mt-3";
        projectSubmissionForm.reset();
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      } catch (error) {
        console.error("EmailJS Error Details:", error);
        console.error("Error Code:", error.code);
        console.error("Error Text:", error.text);
        
        // Error: show error message
        let errorMessage = "✗ Failed to submit. ";
        if (error.text) {
          errorMessage += error.text + " ";
        }
        errorMessage += "Please try again or email me directly at abrahamkwesijames@gmail.com";
        projectFormStatus.textContent = errorMessage;
        projectFormStatus.className = "text-sm text-red-400 mt-3";
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }

  /* ---------- Misc ---------- */
  yearEl && (yearEl.textContent = new Date().getFullYear());
  window.lucide?.createIcons();
});

