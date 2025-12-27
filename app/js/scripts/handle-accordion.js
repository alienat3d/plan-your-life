export default function handleAccordionFunc() {
  const faqAccordion = document.querySelector(".faq-accordion");

  faqAccordion.addEventListener("click", (evt) => {
    if (evt.target.closest(".faq-accordion__item")) {
      evt.target
        .closest(".faq-accordion__item")
        .classList.toggle("faq-accordion__item--active");
    }
  });
}
