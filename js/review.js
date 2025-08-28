// انتخاب عناصر DOM
const navbarBtn = document.querySelector("#navbar-btn");
const desktopNav = document.querySelector("#desktop-nav nav");
const mobileNav = document.querySelector("#mobile-nav nav");
const sidebarDesktop = document.querySelector(".sidebar");
const sidebarMobile = document.querySelector(".sidebar-nav");
const mainContent = document.querySelector(".main");
const sidebarMobileClose = document.querySelector("#sidebar-close svg");
const overlay = document.querySelector("#mobile-overlay");
const userTitle = document.querySelector("#user-title");
const userLogout = document.querySelector("#user-logout");
const logoutButton = document.querySelector("#logout-button");
const cardsContainer = document.querySelector("#cards");
const userTable = document.querySelector("#user-table");

// -----------همگام‌سازی منو دسکتاپ و موبایل-----------
if (desktopNav && mobileNav) {
  mobileNav.innerHTML = desktopNav.innerHTML;
}

// --------- بررسی وضعیت ورود کاربر و نمایش منو -------------
function manageAuth() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("loggedUser");
  if (token && username) {
    // نمایش نام کاربر
    userTitle.innerHTML = `${username}`;
    // باز و بسته کردن منوی خروج
    userTitle.addEventListener("click", () => {
      userLogout.classList.toggle("hidden");
    });
    // دکمه خروج
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUser");
      location.reload(); // رفرش صفحه پس از خروج
    });
  } else {
    // اگر کاربر لاگین نیست، لینک ورود نمایش داده شود
    userTitle.innerHTML = `<a href="./login.html">ورود</a>`;
    userLogout.classList.add("hidden");
  }
}

// باز و بسته کردن منو
navbarBtn.addEventListener("click", () => {
  if (window.innerWidth > 800) {
    // حالت دسکتاپ: نمایش/مخفی کردن سایدبار
    sidebarDesktop.classList.toggle("hidden"); // مخفی/نمایش منوی دسکتاپ
    mainContent.classList.toggle("full");
  } else {
    // حالت موبایل: نمایش سایدبار و overlay
    sidebarMobile.classList.add("active");
    overlay.classList.add("show");
  }
});

// بستن سایدبار موبایل با دکمه
if (sidebarMobileClose) {
  sidebarMobileClose.addEventListener("click", () => {
    sidebarMobile.classList.remove("active");
    overlay.classList.remove("show");
  });
}

// بستن سایدبار موبایل با کلیک روی overlay
overlay.addEventListener("click", (e) => {
  if (!sidebarMobile.contains(e.target)) {
    sidebarMobile.classList.remove("active");
    overlay.classList.remove("show");
  }
});

// مخفی کردن منوی خروج هنگام کلیک بیرون
window.addEventListener("click", (e) => {
  if (!userLogout.contains(e.target) && !userTitle.contains(e.target)) {
    userLogout.classList.add("hidden");
  }
});
// ساخت کارت ها و چارت ها
async function getFetchCards() {
  try {
    const response = await fetch(
      "https://68ac6aa37a0bbe92cbba5f17.mockapi.io/dashboard"
    );
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
        labels: data[0].dashboard.reviews.labels,
        datasets: [
          {
            label: "دیدگاه‌ها",
            data: data[0].dashboard.reviews.data,
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
