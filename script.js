// ===============================
// NAVBAR SCROLL EFFECT
// ===============================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===============================
// MOBILE MENU
// ===============================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// ===============================
// TYPING EFFECT
// ===============================
const text = "Model | Actor | Open for Work";
const typingElement = document.getElementById("typingText");

let i = 0;

function typeEffect() {
  if (i < text.length) {
    typingElement.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 80);
  }
}

typeEffect();

// ===============================
// SCROLL PROGRESS BAR
// ===============================
const progress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  let scrollTop = document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  let percent = (scrollTop / height) * 100;
  progress.style.width = percent + "%";
});

// ===============================
// REVEAL ANIMATION
// ===============================
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// ===============================
// PORTFOLIO FILTER
// ===============================
const filterBtns = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    items.forEach((item) => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// ===============================
// LIGHTBOX
// ===============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");

document.querySelectorAll(".portfolio-zoom").forEach((btn) => {
  btn.addEventListener("click", () => {
    lightbox.classList.add("open");
    lightboxImg.src = btn.dataset.src;
    lightboxCaption.textContent = btn.dataset.title;
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

// ===============================
// CONTACT FORM (FAKE SUBMIT)
// ===============================
const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Message sent successfully!");
  form.reset();
});

// ===============================
// YEAR AUTO UPDATE
// ===============================
document.getElementById("year").textContent = new Date().getFullYear();