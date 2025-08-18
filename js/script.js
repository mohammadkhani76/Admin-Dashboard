const nav = document.querySelector("#nav");
const sidebarSection = document.querySelector("#sidebar-section");

function updateSidebarOnResize() {
  if (window.innerWidth >= 768) {
    sidebarSection.classList.remove("hidden");
    sidebarSection.classList.remove("mobile-active");
  } else {
    sidebarSection.classList.add("hidden");
    sidebarSection.classList.remove("mobile-active");
  }
}

// کلیک روی آیکون منو
nav.addEventListener("click", (e) => {
  e.stopPropagation(); // جلوگیری از trigger شدن window click
  if (window.innerWidth >= 768) {
    sidebarSection.classList.toggle("hidden");
  } else {
    sidebarSection.classList.add("mobile-active");
  }
});

// جلوگیری از بسته شدن وقتی داخل سایدبار کلیک شد
sidebarSection.addEventListener("click", (e) => {
  e.stopPropagation();
});

// کلیک بیرون از سایدبار در موبایل
window.addEventListener("click", () => {
  if (
    window.innerWidth < 768 &&
    sidebarSection.classList.contains("mobile-active")
  ) {
    sidebarSection.classList.remove("mobile-active");
  }
});

// هنگام resize یا load
window.addEventListener("resize", updateSidebarOnResize);
updateSidebarOnResize();
