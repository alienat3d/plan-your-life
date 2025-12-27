import { getScrollbarWidth } from "./utils";

export default function handleBurgerMenu() {
  const body = document.body;
  const header = document.querySelector(".section-header");
  const headerNav = header.querySelector("#header-nav");
  const burgerBtn = headerNav.querySelector(".btn-burger");
  const scrollWidth = getScrollbarWidth();

  const hideScroll = () => {
    body.style.paddingRight = `${scrollWidth}px`;
    body.style.overflowY = "hidden";
    headerNav.style.paddingRight = `${scrollWidth}px`;
  };

  const showScroll = () => {
    body.style.paddingRight = "";
    body.style.overflowY = "visible";
    headerNav.style.paddingRight = "";
  };

  const resetNav = () => {
    showScroll();
    header.classList.remove("section-header--active-open");
  };

  burgerBtn.addEventListener("click", () => {
    body.style.overflowY = "hidden";
    header.classList.toggle("section-header--active-open");

    header.classList.contains("section-header--active-open")
      ? hideScroll()
      : showScroll();
  });

  window.addEventListener("resize", resetNav);
}
