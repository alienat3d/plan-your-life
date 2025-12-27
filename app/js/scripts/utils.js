export function getScrollbarWidth() {
  const outer = document.createElement("div");
  let scrollbarWidth;

  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  outer.style.width = "50px";
  outer.style.height = "50px";
  outer.style.overflow = "scroll";
  outer.style.visibility = "hidden";

  document.body.appendChild(outer);
  scrollbarWidth = outer.offsetWidth - outer.clientWidth;
  document.body.removeChild(outer);

  return scrollbarWidth;
}
