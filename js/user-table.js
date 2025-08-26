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
// بررسی نمایش پنل به کاربر
function checkAuth() {
  const token = localStorage.getItem("token");
  // const navbarLinks = document.querySelectorAll("nav ul li a");

  if (!token) {
    // اگر کاربر لاگین نکرده
    mainContent.innerHTML = `
    <p class="islogin">
  <a href="./login.html">.جهت ورود به پنل <strong> کلیک </strong>نمایید</a>
</p>`;

    // غیر فعال کردن لینک‌های منو
    // navbarLinks.forEach((link) => {
    //   link.classList.add("disabled");
    //   link.addEventListener("click", (e) => e.preventDefault());
    // });
  }
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

//  ساخت جدول کاربران
// ساخت جدول کاربران
async function getUserTable() {
  try {
    const response = await fetch(
      "https://68ac6aa37a0bbe92cbba5f17.mockapi.io/table"
    );
    if (!response.ok) throw new Error(`HTTP ERROR! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    userTable.innerHTML = "";
    data.forEach((user) => {
      const userData = `
      <tr>
        <td class="td-setting">
          <button class="delete-btn table-btn" data-id="${user.id}">حذف</button>
        </td>
        <td>${user.role}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.name}</td>
      </tr>`;
      userTable.innerHTML += userData;
    });

    // اضافه کردن EventListener به دکمه‌های حذف
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await deleteItem(id);
        getUserTable(); // رفرش جدول بعد از حذف
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// حذف آیتم از json-server
async function deleteItem(id) {
  try {
    await fetch(`https://68ac6aa37a0bbe92cbba5f17.mockapi.io/table/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
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
  getUserTable();
  manageAuth();
  checkAuth();
});
