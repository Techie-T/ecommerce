// User storage and management
class UserManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  loadUsers() {
    const users = localStorage.getItem("treasureUsers");
    return users ? JSON.parse(users) : [];
  }

  saveUsers() {
    localStorage.setItem("treasureUsers", JSON.stringify(this.users));
  }

  loadCurrentUser() {
    const currentUser = localStorage.getItem("treasureCurrentUser");
    return currentUser ? JSON.parse(currentUser) : null;
  }

  saveCurrentUser(user) {
    localStorage.setItem("treasureCurrentUser", JSON.stringify(user));
    this.currentUser = user;
  }

  clearCurrentUser() {
    localStorage.removeItem("treasureCurrentUser");
    this.currentUser = null;
  }

  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  }

  userExists(email, phone, username) {
    return this.users.find(
      (user) =>
        user.email === email ||
        user.phone === phone ||
        user.username === username
    );
  }

  createUser(userData) {
    const existingUser = this.userExists(
      userData.email,
      userData.phone,
      userData.username
    );
    if (existingUser) {
      if (existingUser.email === userData.email) {
        return { success: false, message: "Email already registered" };
      }
      if (existingUser.phone === userData.phone) {
        return {
          success: false,
          message: "Phone number already registered",
        };
      }
      if (existingUser.username === userData.username) {
        return { success: false, message: "Username already taken" };
      }
    }

    const passwordError = this.validatePassword(userData.password);
    if (passwordError) {
      return { success: false, message: passwordError };
    }

    this.users.push({
      ...userData,
      createdAt: new Date().toISOString(),
    });
    this.saveUsers();
    return { success: true, message: "Account created successfully" };
  }

  authenticateUser(usernameOrEmail, password) {
    const user = this.users.find(
      (u) =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.password === password
    );
    if (user) {
      this.saveCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: "Invalid credentials" };
  }

  getUserByPhone(phone) {
    return this.users.find((u) => u.phone === phone);
  }
}

const userManager = new UserManager();
let currentVerificationCode = null;
let verificationPhone = null;

// Form management functions
function showSignIn() {
  hideAllForms();
  document.getElementById("signInForm").classList.remove("hidden");
}

function showSignUp() {
  hideAllForms();
  document.getElementById("signUpForm").classList.remove("hidden");
}

function showForgotPassword() {
  hideAllForms();
  document.getElementById("forgotPasswordForm").classList.remove("hidden");
}

function showVerification() {
  hideAllForms();
  document.getElementById("verificationForm").classList.remove("hidden");
}

function showPasswordDisplay() {
  hideAllForms();
  document.getElementById("passwordDisplayForm").classList.remove("hidden");
}

function hideAllForms() {
  const forms = [
    "signInForm",
    "signUpForm",
    "forgotPasswordForm",
    "verificationForm",
    "passwordDisplayForm",
  ];
  forms.forEach((formId) => {
    document.getElementById(formId).classList.add("hidden");
  });
}

function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => {
    error.style.display = "none";
    error.textContent = "";
  });
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Event listeners
document
  .getElementById("signUpFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById("signUpUsername").value.trim();
    const phone = document.getElementById("signUpPhone").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById(
      "signUpConfirmPassword"
    ).value;

    let hasError = false;

    if (!username) {
      showError("signUpUsernameError", "Username is required");
      hasError = true;
    }

    if (!phone) {
      showError("signUpPhoneError", "Phone number is required");
      hasError = true;
    }

    if (!email) {
      showError("signUpEmailError", "Email is required");
      hasError = true;
    }

    if (!password) {
      showError("signUpPasswordError", "Password is required");
      hasError = true;
    } else {
      const passwordError = userManager.validatePassword(password);
      if (passwordError) {
        showError("signUpPasswordError", passwordError);
        hasError = true;
      }
    }

    if (password !== confirmPassword) {
      showError("signUpConfirmPasswordError", "Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    const result = userManager.createUser({
      username,
      phone,
      email,
      password,
    });

    if (result.success) {
      alert("Account created successfully! Please sign in.");
      showSignIn();
    } else {
      if (result.message.includes("Email")) {
        showError("signUpEmailError", result.message);
      } else if (result.message.includes("Phone")) {
        showError("signUpPhoneError", result.message);
      } else if (result.message.includes("Username")) {
        showError("signUpUsernameError", result.message);
      } else {
        showError("signUpPasswordError", result.message);
      }
    }
  });

document
  .getElementById("signInFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const usernameOrEmail = document
      .getElementById("signInUsername")
      .value.trim();
    const password = document.getElementById("signInPassword").value;

    if (!usernameOrEmail) {
      showError("signInUsernameError", "Username or email is required");
      return;
    }

    if (!password) {
      showError("signInPasswordError", "Password is required");
      return;
    }

    const result = userManager.authenticateUser(usernameOrEmail, password);

    if (result.success) {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      showError("signInPasswordError", result.message);
    }
  });

document
  .getElementById("forgotPasswordFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const phone = document.getElementById("forgotPhone").value.trim();

    if (!phone) {
      showError("forgotPhoneError", "Phone number is required");
      return;
    }

    const user = userManager.getUserByPhone(phone);
    if (!user) {
      showError("forgotPhoneError", "Phone number not found");
      return;
    }

    verificationPhone = phone;
    currentVerificationCode = generateVerificationCode();

    // Show the generated code (in real app, this would be sent via SMS)
    document.getElementById("generatedCode").textContent =
      currentVerificationCode;
    document.getElementById("verificationCodeSuccess").style.display = "block";

    showVerification();
  });

document
  .getElementById("verificationFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const enteredCode = document
      .getElementById("verificationCode")
      .value.trim();

    if (!enteredCode) {
      showError("verificationCodeError", "Verification code is required");
      return;
    }

    if (enteredCode !== currentVerificationCode) {
      showError("verificationCodeError", "Invalid verification code");
      return;
    }

    const user = userManager.getUserByPhone(verificationPhone);
    document.getElementById("displayedPassword").textContent = user.password;
    showPasswordDisplay();
  });

// Profile modal functions
function openProfileModal() {
  if (!userManager.currentUser) {
    window.location.href = "auth.html";
    return;
  }

  const user = userManager.currentUser;
  document.getElementById("profileAvatar").textContent = user.username
    .charAt(0)
    .toUpperCase();
  document.getElementById("profileName").textContent = user.username;

  const profileInfo = document.getElementById("profileInfo");
  profileInfo.innerHTML = `
          <div class="profile-info-item">
              <span class="profile-info-label">Username:</span>
              <span class="profile-info-value">${user.username}</span>
          </div>
          <div class="profile-info-item">
              <span class="profile-info-label">Email:</span>
              <span class="profile-info-value">${user.email}</span>
          </div>
          <div class="profile-info-item">
              <span class="profile-info-label">Phone:</span>
              <span class="profile-info-value">${user.phone}</span>
          </div>
          <div class="profile-info-item">
              <span class="profile-info-label">Member Since:</span>
              <span class="profile-info-value">${new Date(
                user.createdAt
              ).toLocaleDateString()}</span>
          </div>
      `;

  document.getElementById("profileModal").style.display = "block";
}

function closeProfileModal() {
  document.getElementById("profileModal").style.display = "none";
}

function logout() {
  userManager.clearCurrentUser();
  closeProfileModal();

  alert("Logged out successfully!");

  showSignIn();
}

// Modal event listeners
document
  .querySelector(".profile-close")
  .addEventListener("click", closeProfileModal);

window.addEventListener("click", function (event) {
  const modal = document.getElementById("profileModal");
  if (event.target === modal) {
    closeProfileModal();
  }
});

// Check if user is already logged in
window.addEventListener("load", function () {
  if (userManager.currentUser) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "profile") {
      openProfileModal();
    } else {
      window.location.href = "index.html";
    }
  } else {
    showSignIn();
  }
});

// Make functions available globally for HTML onclick handlers
window.showSignIn = showSignIn;
window.showSignUp = showSignUp;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.openProfileModal = openProfileModal;
window.logout = logout;
