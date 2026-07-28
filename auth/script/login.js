const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const form = document.getElementById("login-form");

const username = document.getElementById("username");
const usernameError = document.getElementById("usernameError");

const password = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const loginBtn = document.getElementById("login-btn");

const togglePassword = document.getElementById("toggle-password");

// Trạng thái đã tương tác hay chưa
let emailTouched = false;
let passwordTouched = false;

// Ban đầu khóa nút
loginBtn.disabled = true;

// ======================
// Validate chung
// ======================
function validateField(
  input,
  errorElement,
  regex,
  emptyMessage,
  invalidMessage,
  touched,
) {
  const value = input.value.trim();

  // Chưa tương tác thì không hiện lỗi
  if (!touched) {
    errorElement.textContent = "";
    return regex.test(value);
  }

  if (value === "") {
    errorElement.textContent = emptyMessage;
    return false;
  }

  if (!regex.test(value)) {
    errorElement.textContent = invalidMessage;
    return false;
  }

  errorElement.textContent = "";
  return true;
}

// Validate Email
const validateEmail = () => {
  return validateField(
    username,
    usernameError,
    usernameRegex,
    "Vui lòng nhập email",
    "Email không đúng định dạng",
    emailTouched,
  );
};

// Validate Password
const validatePassword = () => {
  return validateField(
    password,
    passwordError,
    passwordRegex,
    "Vui lòng nhập mật khẩu",
    "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
    passwordTouched,
  );
};

// Bật / tắt nút Login
function updateButtonState() {
  const emailOK = usernameRegex.test(username.value.trim());
  const passwordOK = passwordRegex.test(password.value.trim());

  loginBtn.disabled = !(emailOK && passwordOK);
}

// Input Email
username.addEventListener("input", () => {
  emailTouched = true;

  validateEmail();

  updateButtonState();
});

// Input Password
password.addEventListener("input", () => {
  passwordTouched = true;

  validatePassword();

  updateButtonState();
});

// Submit
const VALID_EMAIL = "admin@gmail.com";
const VALID_PASSWORD = "Admin123";

let loginAttempts = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  emailTouched = true;
  passwordTouched = true;

  const emailOK = validateEmail();
  const passwordOK = validatePassword();

  if (!(emailOK && passwordOK)) {
    return;
  }

  if (
    username.value.trim() === VALID_EMAIL &&
    password.value.trim() === VALID_PASSWORD
  ) {
    alert("Đăng nhập thành công");
    window.location.href = "../home.html";
  } else {
    loginAttempts++;

    if (loginAttempts >= 5) {
      alert("Bạn đã nhập sai quá 5 lần. Vui lòng thử lại sau!!!");
      document.querySelector(".primary-button").disabled = true;
    } else {
      alert(`Sai tài khoản  hoặc mật khẩu. Còn ${5 - loginAttempts} lần thử.`);
    }
  }
});

//Show/hide password
togglePassword.addEventListener("click", () => {
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
});
