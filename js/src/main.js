import Swiper from "swiper";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

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
