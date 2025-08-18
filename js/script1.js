const navbarBtn = document.querySelector("#navbar-btn");
const desktopNav = document.querySelector("#desktop-nav nav");
const mobileNav = document.querySelector("#mobile-nav nav");

const sidebarDesktop = document.querySelector(".sidebar");
const sidebarMobile = document.querySelector(".sidebar-nav");

const mainContent = document.querySelector("#main-content");
const sidebarMobileClose = document.querySelector("#sidebar-close svg");
const overlay = document.querySelector("#mobile-overlay");

// // ---------------- کپی کردن منو ----------------

if (desktopNav && mobileNav) {
  mobileNav.innerHTML = desktopNav.innerHTML;
}
// کلیک روی دکمه منو
// navbarBtn.addEventListener("click", () => {
//   if (window.innerWidth <= 768) {
//     // موبایل
//     sidebarDesktop.classList.add("desktophidden");
//     mainContent.classList.add("full");
//     sidebarMobile.classList.remove("mobilehidden");
//     overlay.classList.add("show");
//   } else {
//     // دسکتاپ
//     sidebarDesktop.classList.toggle("desktophidden");
//     mainContent.classList.toggle("full");
//     sidebarMobile.classList.add("mobilehidden");
//     overlay.classList.remove("show");
//   }
// });

// // کلیک روی دکمه بستن موبایل
// if (sidebarMobileClose) {
//   sidebarMobileClose.addEventListener("click", () => {
//     sidebarMobile.classList.add("mobilehidden");
//     overlay.classList.remove("show");
//   });
// }

// // وقتی صفحه resize شد
// window.addEventListener("resize", () => {
//   if (window.innerWidth > 768) {
//     // دسکتاپ
//     sidebarDesktop.classList.remove("desktophidden"); // دسکتاپ نمایش
//     sidebarMobile.classList.add("mobilehidden"); // موبایل مخفی
//     mainContent.classList.remove("full");
//   } else {
//     // موبایل
//     sidebarDesktop.classList.add("desktophidden"); // دسکتاپ مخفی در موبایل
//     sidebarMobile.classList.add("mobilehidden");
//     mainContent.classList.remove("full");
//   }
// });
// کلیک روی دکمه منو
navbarBtn.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    // موبایل
    sidebarDesktop.classList.add("desktophidden");
    mainContent.classList.add("full");
    sidebarMobile.classList.remove("mobilehidden");
    overlay.classList.add("show");
  } else {
    // دسکتاپ
    sidebarDesktop.classList.toggle("desktophidden");
    mainContent.classList.toggle("full");
    sidebarMobile.classList.add("mobilehidden");
    overlay.classList.remove("show");
  }
});

// کلیک روی دکمه بستن موبایل
if (sidebarMobileClose) {
  sidebarMobileClose.addEventListener("click", () => {
    sidebarMobile.classList.add("mobilehidden");
    overlay.classList.remove("show");
  });
}

// وقتی روی overlay کلیک کردیم، منو رو ببندیم
overlay.addEventListener("click", (e) => {
  if (!sidebarMobile.contains(e.target)) {
    sidebarMobile.classList.add("mobilehidden");
    overlay.classList.remove("show");
  }
});

// وقتی صفحه resize شد
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    // دسکتاپ
    sidebarDesktop.classList.remove("desktophidden");
    sidebarMobile.classList.add("mobilehidden");
    mainContent.classList.remove("full");
    overlay.classList.remove("show"); // مخفی کردن overlay در دسکتاپ
  } else {
    // موبایل
    sidebarDesktop.classList.add("desktophidden");
    sidebarMobile.classList.add("mobilehidden");
    mainContent.classList.remove("full");
  }
});
