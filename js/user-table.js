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
const name = document.querySelector("#name");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const role = document.querySelector("#role");
const formAddUser = document.querySelector("#adduser-form");
const submitBtn = document.querySelector("#submitBtn");
const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#formEditUser");
const editName = document.querySelector("#editName");
const editPhone = document.querySelector("#editPhone");
const editEmail = document.querySelector("#editEmail");
const editRole = document.querySelector("#editRole");
let editUserId = null;
// همگام‌سازی منو دسکتاپ و موبایل
if (desktopNav && mobileNav) {
  mobileNav.innerHTML = desktopNav.innerHTML;
}
// بررسی نمایش پنل به کاربر
function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    // اگر کاربر لاگین نکرده
    mainContent.innerHTML = `
    <p class="islogin">
  <a href="./login.html">.جهت ورود به پنل <strong> کلیک </strong>نمایید</a>
</p>`;
  }
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

// ============================= ساخت جدول کاربران=============================
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
          <button class="delete-btn table-btn" data-id="${
            user.id
          }" data-name="${user.name}">حذف</button>
          <button class="edit-btn table-btn" data-id="${user.id}" data-name="${
        user.name
      }" data-phone="${user.phone}"
          data-email="${user.email}"
          data-role="${user.role.trim()}">ویرایش</button>

        </td>
        <td>${user.role}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.name}</td>
      </tr>`;
      userTable.innerHTML += userData;
    });

    // اضافه کردن EventListener به دکمه‌های حذف
    // document.querySelectorAll(".delete-btn").forEach((btn) => {
    //   btn.addEventListener("click", async (e) => {
    //     const id = e.target.dataset.id;
    //     await deleteItem(id);
    //     getUserTable(); // رفرش جدول بعد از حذف
    //   });
    // });
  } catch (error) {
    console.log(error);
  }
}

// ==============================حذف کردن کاربر=======================
//  Event Delegation برای کل جدول
userTable.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    if (confirm(`آیا مطمئن هستید می‌خواهید  کاربر: ${name} را حذف کنید؟`)) {
      await deleteItem(id);
      alert(`✅ کاربر "${name}" با موفقیت حذف شد!`);
      getUserTable(); // رفرش جدول
    }
  }
});

// ============================تابع delete============================
async function deleteItem(id) {
  try {
    await fetch(`https://68ac6aa37a0bbe92cbba5f17.mockapi.io/table/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
}

// ===========================اضافه کردن کاربر=========================
formAddUser.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    role: role.value.trim(),
  };
  if (!name.value || !phone.value || !email.value || !role.value) {
    alert("لطفاً تمام فیلدها را پر کنید!");
    return;
  }
  await postItem(data);
  formAddUser.reset();
  getUserTable();
});

// =============================تابع post==============================
async function postItem(data) {
  try {
    const response = await fetch(
      "https://68ac6aa37a0bbe92cbba5f17.mockapi.io/table",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error(`HTTP ERROR! Status: ${response.status}`);
    const newUser = await response.json();
    alert(`✅ کاربر "${newUser.name}" با موفقیت اضافه شد!`);
  } catch (error) {
    console.log(error);
    alert("❌ خطا در افزودن کاربر");
  }
}
// =================================ویرایش کردن کاربر====================================
userTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editUserId = e.target.dataset.id;

    // پر کردن فرم modal با داده کاربر
    editName.value = e.target.dataset.name;
    editPhone.value = e.target.dataset.phone;
    editEmail.value = e.target.dataset.email;
    editRole.value = e.target.dataset.role;

    // نمایش modal
    editModal.style.display = "flex";
  }
});

// بستن modal با کلیک روی ×
editModal.querySelector(".close-btn").addEventListener("click", () => {
  editModal.style.display = "none";
});
// ================================
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: editName.value.trim(),
    phone: editPhone.value.trim(),
    email: editEmail.value.trim(),
    role: editRole.value.trim(),
  };
  if (
    !editName.value ||
    !editPhone.value ||
    !editEmail.value ||
    !editRole.value
  ) {
    alert("لطفاً تمام فیلدها را پر کنید!");
    return;
  }

  await putitem(editUserId, data);
  getUserTable();
  editForm.reset();
  editModal.style.display = "none";
});
// =================================تابع PUT  ====================================
async function putitem(editUserId, data) {
  try {
    const response = await fetch(
      `https://68ac6aa37a0bbe92cbba5f17.mockapi.io/table/${editUserId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error(`HTTP ERROR! Status: ${response.status}`);
    const updatedUser = await response.json();
    alert(`✅ ویرایش کاربر "${updatedUser.name}" با موفقیت انجام شد.`);
  } catch (error) {
    console.log(error);
    alert("❌ خطا در ویرایش کاربر");
  }
}

//=====لیست منو قرار گرفتن فلش======
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
