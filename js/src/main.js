import Swiper from "swiper";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const languageSwitchers = document.querySelectorAll(
  "[data-language-switcher]",
);

languageSwitchers.forEach((switcher) => {
  const toggle = switcher.querySelector(".language-switcher__toggle");
  const options = switcher.querySelectorAll(".language-switcher__option");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = switcher.classList.contains("is-open");

    languageSwitchers.forEach((other) => {
      other.classList.remove("is-open");
      other
        .querySelector(".language-switcher__toggle")
        .setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      switcher.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang;

      languageSwitchers.forEach((other) => {
        other
          .querySelectorAll(".language-switcher__option")
          .forEach((o) => o.classList.toggle("is-active", o.dataset.lang === lang));
        other.querySelector(".language-switcher__current").textContent = lang;
        other.classList.remove("is-open");
        other
          .querySelector(".language-switcher__toggle")
          .setAttribute("aria-expanded", "false");
      });
    });
  });
});

document.addEventListener("click", () => {
  languageSwitchers.forEach((switcher) => {
    switcher.classList.remove("is-open");
    switcher
      .querySelector(".language-switcher__toggle")
      .setAttribute("aria-expanded", "false");
  });
});

const slider = document.querySelector(".certificates__slider");

if (slider) {
  const counter = document.querySelector(".certificates__counter");
  const captionText = document.querySelector(".certificates__caption-text");

  const updateCounter = (sw) => {
    if (!counter) return;
    const current = String(sw.realIndex + 1).padStart(2, "0");
    const total = String(sw.slides.length).padStart(2, "0");
    counter.textContent = `${current} / ${total}`;
  };

  const updateCaption = (sw) => {
    if (!captionText) return;
    const active = sw.slides[sw.activeIndex];
    captionText.textContent = active?.dataset.caption || "";
  };

  const slideLinks = Array.from(
    slider.querySelectorAll(".certificates__slide-link"),
  );

  const swiperInstance = new Swiper(slider, {
    modules: [Navigation, Pagination, EffectCoverflow],
    effect: "coverflow",
    speed: 350,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 24,
    initialSlide: 3,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 150,
      modifier: 1.5,
      slideShadows: false,
    },
    navigation: {
      nextEl: ".certificates__nav--next",
      prevEl: ".certificates__nav--prev",
    },
    pagination: {
      el: ".certificates__progress",
      type: "progressbar",
    },
    on: {
      init(sw) {
        updateCounter(sw);
        updateCaption(sw);
      },
      slideChange(sw) {
        updateCounter(sw);
        updateCaption(sw);
      },
    },
  });

  slider.addEventListener("click", (e) => {
    const link = e.target.closest(".certificates__slide-link");
    if (!link) return;
    e.preventDefault();

    const slideEl = link.closest(".swiper-slide");
    if (!slideEl.classList.contains("swiper-slide-active")) {
      swiperInstance.slideTo(swiperInstance.slides.indexOf(slideEl));
      return;
    }

    Fancybox.fromNodes(slideLinks, {
      startIndex: slideLinks.indexOf(link),
    });
  });
}

const mobileNav = document.querySelector("[data-mobile-nav]");
const mobileNavToggle = document.querySelector("[data-mobile-nav-toggle]");
const mobileNavClose = document.querySelector("[data-mobile-nav-close]");
const mobileNavOverlay = document.querySelector("[data-mobile-nav-overlay]");

if (mobileNav && mobileNavToggle && mobileNavOverlay) {
  const openMobileNav = () => {
    mobileNav.classList.add("is-open");
    mobileNavOverlay.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    mobileNavToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove("is-open");
    mobileNavOverlay.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNavToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  mobileNavToggle.addEventListener("click", () => {
    if (mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNavClose?.addEventListener("click", closeMobileNav);
  mobileNavOverlay.addEventListener("click", closeMobileNav);

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    }
  });
}

const audioBtn = document.querySelector("[data-audio-btn]");
const helpAudio = document.querySelector("[data-audio]");

if (audioBtn && helpAudio) {
  const label = audioBtn.querySelector(".help__audio-label");
  const defaultLabel = label ? label.textContent : "";

  const render = (state) => {
    audioBtn.classList.toggle("is-playing", state === "playing");
    audioBtn.classList.toggle("is-loading", state === "loading");
    audioBtn.setAttribute("aria-pressed", String(state === "playing"));
    if (!label) return;
    if (state === "loading") label.textContent = "Завантаження…";
    else if (state === "playing") label.textContent = "Пауза";
    else label.textContent = defaultLabel;
  };

  audioBtn.addEventListener("click", () => {
    if (helpAudio.paused) {
      const played = helpAudio.play();
      if (played && typeof played.catch === "function") {
        played.catch(() => render("paused"));
      }
    } else {
      helpAudio.pause();
    }
  });

  helpAudio.addEventListener("waiting", () => render("loading"));
  helpAudio.addEventListener("playing", () => render("playing"));
  helpAudio.addEventListener("play", () => {
    if (helpAudio.readyState < 3) render("loading");
  });
  helpAudio.addEventListener("pause", () => render("paused"));
  helpAudio.addEventListener("ended", () => {
    render("paused");
    helpAudio.currentTime = 0;
  });

  window.addEventListener("pagehide", () => helpAudio.pause());
}

const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
  const header = item.querySelector(".faq__item-header");

  header.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("is-active");
      otherItem
        .querySelector(".faq__item-header")
        .setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("is-active");
      header.setAttribute("aria-expanded", "true");
    }
  });
});
