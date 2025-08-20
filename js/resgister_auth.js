//  ارجاع به فرم و فیلدها
const registerForm = document.querySelector("#registerForm");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const notification = document.querySelector("#notification");
let users = [];

// ذخیره‌سازی در localStorage
function saveToLocalStorage() {
  localStorage.setItem("user", JSON.stringify(users));
}

// بارگذاری داده‌ها از localStorage
function loadFromLocalStorage() {
  /** 
 * const load = localStorage.getItem("user");
    if (load) {
      users = JSON.parse(load);
      console.log(result);
    } else {
      users = [];
    }
*/
  users = JSON.parse(localStorage.getItem("user")) || [];
}

// اعتبارسنجی نام کاربری (حداقل 4 کاراکتر انگلیسی)
function validUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._-]{3,19}$/;

  if (!usernameRegex.test(username)) {
    showNotification(
      "**نام کاربری باید حداقل 4 کاراکتر باشد، با یک حرف شروع شود و فقط شامل حروف، اعداد، نقطه ( . )، خط تیره ( - ) یا زیرخط ( _ ) باشد** ",
      "error"
    );
    return false;
  }
  return true;
}

// اعتبارسنجی رمز عبور (حداقل 8 کاراکتر + شرایط امنیتی)
function validPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    showNotification(
      ".رمز عبور باید حداقل ۸ کاراکتر باشد و شامل حروف بزرگ، حروف کوچک، عدد و یک کاراکتر ویژه باشد",
      "error"
    );
    return false;
  }
  return true;
}

//نمایش نوتیفیکیشن به کاربر
function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.classList.remove("hidden", "error");
  notification.classList.add("show");

  if (type === "error") {
    notification.classList.add("error");
  }
  setTimeout(() => {
    notification.classList.remove("show", "error");
    notification.classList.add("hidden");
    notification.textContent = "";
  }, 3000);
}

// افزودن رویداد ارسال فرم ثبت نام
registerForm.addEventListener("submit", (e) => {
  e.preventDefault(); // جلوگیری از ارسال پیش‌فرض فرم
  loadFromLocalStorage();

  // گرفتن مقدار ورودی‌ها و trim کردن username
  const usernameValue = username.value.trim();
  const passwordValue = password.value;

  // اعتبارسنجی نام کاربری و رمز عبور
  const isUsernameValid = validUsername(usernameValue);
  const isPasswordValid = validPassword(passwordValue);

  if (!isUsernameValid || !isPasswordValid) {
    return false;
  }

  // بررسی وجود کاربر
  const userExisting = users.find((user) => user.username === usernameValue);
  if (userExisting) {
    showNotification(".کاربر وجود دارد", "error");
    return;
  }

  // اگر هر دو اعتبارسنجی موفق بودند، پیام موفقیت نمایش داده شود
  users.push({ username: usernameValue, password: passwordValue });
  // users.push({ usernameValue, passwordValue });
  saveToLocalStorage();
  showNotification(`.عزیز ثبت نام شما با موفقیت انجام شد ${username.value}`);

  // username.value = "";
  // password.value = "";
  registerForm.reset();
});
