// ============================================================
// Diakité Cocoa Product — Pure JavaScript Controller
// Navigation fluide entre les pages sans rechargement
// + Envoi d'email réel via EmailJS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Navigation Handler
  const navLinks = document.querySelectorAll("[data-nav-target]");
  const pageViews = document.querySelectorAll(".page-view");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  // Page Loader logic
  const pageLoader = document.getElementById("page-loader");

  function hidePageLoader() {
    if (pageLoader) pageLoader.classList.add("hide");
  }
  function showPageLoader() {
    if (pageLoader) pageLoader.classList.remove("hide");
  }

  window.addEventListener("load", () => {
    setTimeout(hidePageLoader, 700);
  });

  function navigateTo(pageId, productContext = null) {
    pageViews.forEach((view) => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
      targetView.classList.add("active");
    }

    // Update active state in nav links
    navLinks.forEach((link) => {
      if (link.getAttribute("data-nav-target") === pageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close mobile menu if open
    if (mobileMenu) {
      mobileMenu.classList.remove("open");
    }

    // Handle product context selection on contact page
    if (productContext && pageId === "contact") {
      const select = document.getElementById("contact-product-select");
      if (select) {
        select.value = productContext;
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.hash = pageId;
  }

  // Attach click events
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav-target");
      const context = link.getAttribute("data-nav-context");
      showPageLoader();
      setTimeout(() => {
        navigateTo(target, context);
        hidePageLoader();
      }, 700);
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // Product Filter on Products Page
  const filterBtns = document.querySelectorAll("[data-product-filter]");
  const productCards = document.querySelectorAll("[data-product-category]");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-product-filter");
      productCards.forEach((card) => {
        const cat = card.getAttribute("data-product-category");
        if (filterVal === "all" || cat === filterVal) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ------------------------------------------------------------
  // Envoi d'email via EmailJS
  // ------------------------------------------------------------
  const EMAILJS_PUBLIC_KEY = "lr3BQKyp-JjCk1_fx";
  const EMAILJS_SERVICE_ID = "service_swzotxw";
  const EMAILJS_TEMPLATE_ID = "template_j7s9egs";

  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // Contact Form Submission (Real email sending via EmailJS)
  const contactForm = document.getElementById("quote-contact-form");
  const formSuccess = document.getElementById("form-success-box");
  const toastMsg = document.getElementById("toast-msg");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!window.emailjs) {
        showToast(
          "Le service d\u2019envoi n\u2019a pas pu se charger. Merci de réessayer.",
        );
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = "<span>Envoi en cours...</span>";
      btn.disabled = true;

      emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
          contactForm.reset();
          if (formSuccess) {
            formSuccess.style.display = "block";
            formSuccess.scrollIntoView({ behavior: "smooth" });
          }
          showToast(
            "Votre demande a bien été transmise à l\u2019équipe commerciale de Diakité Cocoa Product !",
          );
        })
        .catch((error) => {
          btn.innerHTML = origText;
          btn.disabled = false;

          console.error("Erreur EmailJS:", error);

          alert(
            "❌ ERREUR D'ENVOI DU MAIL\n\n" +
              "Code de l'erreur : " +
              (error.status || "Inconnu") +
              "\n" +
              "Message : " +
              (error.text || error.message || "Erreur inconnue") +
              "\n\n" +
              "Détails techniques :\n" +
              JSON.stringify(error, null, 2),
          );

          showToast(
            "Une erreur est survenue lors de l’envoi. Merci de réessayer.",
          );
        });
    });
  }

  // Helper Toast
  window.showToast = function (msg) {
    if (!toastMsg) return;
    toastMsg.querySelector(".toast-text").innerText = msg;
    toastMsg.classList.add("show");
    setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 4500);
  };

  // Check URL Hash on load
  const currentHash = window.location.hash.replace("#", "");
  if (
    ["home", "about", "products", "engagement", "contact"].includes(currentHash)
  ) {
    navigateTo(currentHash);
  } else {
    navigateTo("home");
  }
});
