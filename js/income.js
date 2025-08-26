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
  if (token && username) {
    userTitle.innerHTML = `${username}`;
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
    // اگر کاربر لاگین نیست، لینک ورود نمایش داده شود
    userTitle.innerHTML = `<a href="./login.html">ورود</a>`;
    userLogout.classList.add("hidden");
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
    const response = await fetch(
      "https://68ac6aa37a0bbe92cbba5f17.mockapi.io/dashboard"
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP ERROR! Status:${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    //  نمودار خطی چارت درامد
    const incomeCtx = document.getElementById("lineChart").getContext("2d");
    new Chart(incomeCtx, {
      type: "line",
      data: {
        labels: data[0].dashboard.income.chart.labels, // محور X
        datasets: [
          {
            label: "درآمد ماهیانه (تومان)",
            data: data[0].dashboard.income.chart.data, // محور Y
            borderColor: "#3366ff",
            backgroundColor: "rgba(51,102,255,0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 14, family: "vazir" } },
          },
          title: {
            display: true,
            text: "نمودار درآمد ماهیانه",
            font: { size: 16, family: "vazir" },
          },
        },
        scales: {
          x: {
            ticks: { font: { family: "vazir", size: 12 } },
          },
          y: {
            beginAtZero: false,
            ticks: {
              font: { size: 14, family: "vazir" },
            },
          },
        },
      },
    });

    // نمودار افقی چارت درامد
    const horizontalBarCtx = document
      .getElementById("horizontalBarChart")
      .getContext("2d");
    new Chart(horizontalBarCtx, {
      type: "bar", // نوع بار
      data: {
        labels: data[0].dashboard.income.chart.labels, // ["فروردین", "اردیبهشت", ...]
        datasets: [
          {
            label: "درآمد ماهیانه (تومان)",
            data: data[0].dashboard.income.chart.data, // [1200000, 1500000, ...]
            backgroundColor: "#4caf50",
          },
        ],
      },
      options: {
        indexAxis: "y", // کلید برای افقی کردن میله‌ها
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: { font: { family: "vazir", size: 14 } },
          },
          title: {
            display: true,
            text: "درآمد ماهیانه ",
            font: { size: 16, family: "vazir" },
          },
          tooltip: {
            titleFont: { family: "vazir", size: 14 },
            bodyFont: { family: "vazir", size: 12 },
          },
        },

        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              font: { size: 12, family: "vazir" },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 12, family: "vazir" },
            },
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
