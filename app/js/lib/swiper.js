import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function swiper() {
  new Swiper(".section-hero-image", {
    modules: [Pagination],
    pagination: {
      el: ".slider-hero-image__pagination",
      clickable: true,
    },
  });

  new Swiper(".slider-blog-container", {
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".btn-blog--next",
      prevEl: ".btn-blog--prev",
    },
    pagination: {
      el: ".slider-blog__pagination",
      clickable: true,
    },
  });
}

/* export default function swiper() {
  const swiper = new Swiper(".slider-blog", {
    modules: [Navigation, Pagination],
    pagination: {
      el: ".slider-hero-image__pagination",
      clickable: true,
    },
  });
} */
