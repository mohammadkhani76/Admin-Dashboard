const nav = document.querySelector("#nav");
const sidebarSection = document.querySelector("#sidebar-section");
nav.addEventListener("click", () => {
  sidebarSection.classList.toggle("hidden");
});
