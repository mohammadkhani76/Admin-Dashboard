const navbarBtn = document.querySelector("#navbar-btn");
const desktopNav = document.querySelector("#desktop-nav nav");
const mobileNav = document.querySelector("#mobile-nav nav");
// سایدبار
const sidebarDesktop = document.querySelector(".sidebar");
const sidebarMobile = document.querySelector(".sidebar-nav");
const mainContent = document.querySelector(".main");
const sidebarMobileClose = document.querySelector("#sidebar-close svg");
const overlay = document.querySelector("#mobile-overlay");
// پروفایل
const userTitle = document.querySelector("#user-title");
const userLogout = document.querySelector("#user-logout");
const logoutButton = document.querySelector("#logout-button");

// car
const cardsContainer = document.querySelector("#cards");

// table
const userTable = document.querySelector("#user-table");

// ---------------- کپی کردن منو ----------------
if (desktopNav && mobileNav) {
  mobileNav.innerHTML = desktopNav.innerHTML;
}
// --------- بررسی وضعیت ورود کاربر و نمایش منو -------------
function manageAuth() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("loggedUser");
  if (token) {
    userTitle.textContent = `${username}`;
    // نام کاربری
    userTitle.addEventListener("click", () => {
      userLogout.classList.toggle("hidden");
    });
    // دکمه خروج
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUser");
      location.reload();
    });
  } else {
    userTitle.addEventListener("click", () => {
      userLogout.classList.add("hidden");
    });
  }
}

// کلیک روی دکمه منو
navbarBtn.addEventListener("click", () => {
  if (window.innerWidth <= 800) {
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
  if (window.innerWidth > 800) {
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

// ساخت کارت ها و چارت ها
async function getFetchCards() {
  try {
    const response = await fetch("http://localhost:3000/dashboard");
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP ERROR! Status:${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    // نمودار دایره‌ای
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: data.reviews.labels,
        datasets: [
          {
            label: "دیدگاه‌ها",
            data: data.reviews.data,
            backgroundColor: [
              "#3366ff",
              "#4caf50",
              "#f44336",
              "#ff9800",
              "#9c27b0",
              "#00bcd4",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { font: { family: "vazir", size: 14 } },
          },
          title: {
            display: true,
            text: "دیدگاه‌های کاربران",
            font: { size: 16, family: "vazir" },
          },
          tooltip: {
            bodyFont: { family: "vazir", size: 14 },
            titleFont: { family: "vazir", size: 14 },
          },
        },
      },
    });
  } catch (error) {
    console.error("خطا در دریافت اطلاعات", error);
  }
}

//لیست منو قرار گرفتن فلش
document.querySelectorAll("nav ul li").forEach((li) => {
  if (li.querySelector("ul")) {
    li.classList.add("dropdown"); // فقط به اونایی که ul داخلشون هست کلاس بده
  }
});

// اجرای اولیه
window.addEventListener("DOMContentLoaded", () => {
  getFetchCards();
  manageAuth();
});
