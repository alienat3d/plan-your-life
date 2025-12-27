import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function swiper() {
  const swiper = new Swiper(".section-hero-image", {
    modules: [Navigation, Pagination],
    pagination: {
      el: ".slider-hero-image__pagination",
      clickable: true,
    },
  });
}
