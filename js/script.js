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
  }
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

// =====ساخت کارت‌ها=====
async function getFetchCards() {
  try {
    const response = await fetch("./data.json");
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP ERROR! Status:${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    cardsContainer.innerHTML = "";
    data.cards.forEach((card) => {
      const div = document.createElement("div");
      div.classList.add("card");
      // شرط رنگ بر اساس درصد
      const isPositive = card.percentage >= 0;
      const percentageClass = isPositive ? "positive" : "negative"; // رنگ بکگراندبر اساس مثبت یا منفی

      // برای قرار دادن فلش بالا و پایین
      const arrow = isPositive
        ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
        </svg>`;
      const ordersCountColor = isPositive ? "positive" : "negative"; // تعیین رنگ مقدار count
      // جایگذاری کارت ها
      div.innerHTML = `
        <h3>${card.title} </h3>
            <p class="orders-count ${ordersCountColor}" id="orders-count">${card.count}</p>
        <div class="card-stats ${percentageClass}">
              <p class="card-percentage" id="orders-percentage">${card.percentage}%</p>
        <div class="status">
              <p class="card-status" id="orders-status">${card.status}</p>
              ${arrow}
        </div>
        </div>`;
      cardsContainer.appendChild(div);
    });

    // بار چارت (میله‌ای)
    const barCtx = document.getElementById("barChart").getContext("2d");
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: data.chart.labels,
        datasets: [
          {
            label: "سفارش‌ها",
            data: data.chart.data,
            backgroundColor: "#3366ff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { family: "vazir", size: 14 }, // فونت Legend
            },
          },
          title: {
            display: true,
            text: "تعداد سفارش‌ها",
            font: { size: 16, family: "vazir" }, // فونت Title
          },
          tooltip: {
            bodyFont: { family: "vazir", size: 14 }, // فونت Tooltip
            titleFont: { family: "vazir", size: 14 },
          },
        },
        scales: {
          x: {
            ticks: { font: { family: "vazir", size: 14 } }, // فونت محور X
          },
          y: {
            ticks: { font: { family: "vazir", size: 14 } }, // فونت محور Y
          },
        },
      },
    });

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
    // جدول کاربران
    userTable.innerHTML = "";
    data.table.forEach((user) => {
      const userData = `<tr>
      <td>${user.role}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td> ${user.name}</td>
      </tr>`;
      userTable.innerHTML += userData;
    });

    //  نمودار خطی چارت درامد
    const incomeCtx = document.getElementById("lineChart").getContext("2d");
    new Chart(incomeCtx, {
      type: "line",
      data: {
        labels: data.income.chart.labels, // محور X
        datasets: [
          {
            label: "درآمد ماهیانه (تومان)",
            data: data.income.chart.data, // محور Y
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
        labels: data.income.chart.labels, // ["فروردین", "اردیبهشت", ...]
        datasets: [
          {
            label: "درآمد ماهیانه (تومان)",
            data: data.income.chart.data, // [1200000, 1500000, ...]
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
