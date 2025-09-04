"use strict";

// modal variables
const modal = document.querySelector("[data-modal]");
const modalCloseBtn = document.querySelector("[data-modal-close]");
const modalCloseOverlay = document.querySelector("[data-modal-overlay]");

// modal function
const modalCloseFunc = function () {
  modal.classList.add("closed");
};

// modal eventListener
modalCloseOverlay.addEventListener("click", modalCloseFunc);
modalCloseBtn.addEventListener("click", modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector("[data-toast]");
const toastCloseBtn = document.querySelector("[data-toast-close]");

// notification toast eventListener
toastCloseBtn.addEventListener("click", function () {
  notificationToast.classList.add("closed");
});

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll(
  "[data-mobile-menu-open-btn]"
);
const mobileMenu = document.querySelectorAll("[data-mobile-menu]");
const mobileMenuCloseBtn = document.querySelectorAll(
  "[data-mobile-menu-close-btn]"
);
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove("active");
    overlay.classList.remove("active");
  };

  mobileMenuOpenBtn[i].addEventListener("click", function () {
    mobileMenu[i].classList.add("active");
    overlay.classList.add("active");
  });

  mobileMenuCloseBtn[i].addEventListener("click", mobileMenuCloseFunc);
  overlay.addEventListener("click", mobileMenuCloseFunc);
}

// accordion variables
const accordionBtn = document.querySelectorAll("[data-accordion-btn]");
const accordion = document.querySelectorAll("[data-accordion]");

for (let i = 0; i < accordionBtn.length; i++) {
  accordionBtn[i].addEventListener("click", function () {
    const clickedBtn = this.nextElementSibling.classList.contains("active");

    for (let i = 0; i < accordion.length; i++) {
      if (clickedBtn) break;

      if (accordion[i].classList.contains("active")) {
        accordion[i].classList.remove("active");
        accordionBtn[i].classList.remove("active");
      }
    }

    this.nextElementSibling.classList.toggle("active");
    this.classList.toggle("active");
  });
}
// User Authentication Functions
function checkUserAuth() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser;
}

function updateUserDisplay() {
  const user = checkUserAuth();
  const desktopUserBtn = document.querySelector(
    ".desktop-navigation-menu .action-btn"
  );
  const mobileUserBtn = document.querySelector(
    ".mobile-bottom-navigation .action-btn:last-child"
  );

  if (user) {
    // Update desktop user button
    if (desktopUserBtn) {
      desktopUserBtn.innerHTML = `
        <div class="user-menu" style="position: relative;">
          <div class="user-avatar" onclick="toggleUserDropdown()" style="display: flex; align-items: center; cursor: pointer; padding: 8px; border-radius: 20px; background: linear-gradient(135deg, var(--ocean-green), var(--salmon-pink)); color: white;">
            <span style="font-size: 12px; font-weight: 500; margin-right: 5px;">${
              user.fullname.split(" ")[0]
            }</span>
            <ion-icon name="person-outline"></ion-icon>
          </div>
          <div class="user-dropdown" id="user-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 15px; min-width: 200px; z-index: 1000; border: 1px solid var(--cultured);">
            <div class="user-info" style="border-bottom: 1px solid var(--cultured); padding-bottom: 10px; margin-bottom: 10px;">
              <p style="font-weight: 600; color: var(--eerie-black); margin-bottom: 2px; font-size: 14px;">${
                user.fullname
              }</p>
              <p style="color: var(--sonic-silver); font-size: 12px;">${
                user.email
              }</p>
            </div>
            <div class="user-actions">
              <button onclick="showUserOrders()" style="display: flex; align-items: center; width: 100%; padding: 8px 0; border: none; background: none; color: var(--eerie-black); cursor: pointer; font-size: 14px; margin-bottom: 8px;">
                <ion-icon name="receipt-outline" style="margin-right: 8px;"></ion-icon>
                My Orders
              </button>
              <button onclick="logoutUser()" style="display: flex; align-items: center; width: 100%; padding: 8px 0; border: none; background: none; color: var(--salmon-pink); cursor: pointer; font-size: 14px;">
                <ion-icon name="log-out-outline" style="margin-right: 8px;"></ion-icon>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Update mobile user button
    if (mobileUserBtn) {
      mobileUserBtn.innerHTML = `
        <div onclick="toggleMobileUserModal()" style="position: relative;">
          <div style="display: flex; align-items: center; justify-content: center; width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean-green), var(--salmon-pink)); color: white; font-size: 12px; font-weight: 600;">
            ${user.fullname.charAt(0).toUpperCase()}
          </div>
        </div>
      `;
    }
  } else {
    // Show sign in buttons when not logged in
    if (desktopUserBtn) {
      desktopUserBtn.innerHTML = `<ion-icon name="person-outline"></ion-icon>`;
      desktopUserBtn.onclick = () => (window.location.href = "auth.html");
    }
    if (mobileUserBtn) {
      mobileUserBtn.innerHTML = `<ion-icon name="person-outline"></ion-icon>`;
      mobileUserBtn.onclick = () => (window.location.href = "auth.html");
    }
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

  // Close dropdown when clicking outside
  document.addEventListener("click", function closeDropdown(e) {
    if (!e.target.closest(".user-menu")) {
      dropdown.style.display = "none";
      document.removeEventListener("click", closeDropdown);
    }
  });
}

function toggleMobileUserModal() {
  const user = checkUserAuth();
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  // Create mobile user modal
  const modal = document.createElement("div");
  modal.id = "mobile-user-modal";
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: flex-end;">
      <div style="background: white; width: 100%; border-radius: 20px 20px 0 0; padding: 25px; max-height: 70vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: var(--eerie-black);">Account</h3>
          <button onclick="closeMobileUserModal()" style="background: none; border: none; font-size: 24px; color: var(--sonic-silver); cursor: pointer;">×</button>
        </div>
        
        <div style="display: flex; align-items: center; padding: 15px; background: var(--cultured); border-radius: 10px; margin-bottom: 20px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--ocean-green), var(--salmon-pink)); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 600; margin-right: 15px;">
            ${user.fullname.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style="margin: 0; font-weight: 600; color: var(--eerie-black);">${
              user.fullname
            }</p>
            <p style="margin: 0; color: var(--sonic-silver); font-size: 14px;">${
              user.email
            }</p>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <button onclick="showUserOrders()" style="display: flex; align-items: center; padding: 15px; background: none; border: 1px solid var(--cultured); border-radius: 10px; color: var(--eerie-black); cursor: pointer; font-size: 16px; width: 100%;">
            <ion-icon name="receipt-outline" style="margin-right: 12px; font-size: 20px;"></ion-icon>
            My Orders
          </button>
          
          <button onclick="logoutUser()" style="display: flex; align-items: center; padding: 15px; background: none; border: 1px solid var(--salmon-pink); border-radius: 10px; color: var(--salmon-pink); cursor: pointer; font-size: 16px; width: 100%;">
            <ion-icon name="log-out-outline" style="margin-right: 12px; font-size: 20px;"></ion-icon>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeMobileUserModal() {
  const modal = document.getElementById("mobile-user-modal");
  if (modal) {
    modal.remove();
  }
}

function showUserOrders() {
  const user = checkUserAuth();
  if (!user) return;

  // Close any open dropdowns/modals
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) dropdown.style.display = "none";
  closeMobileUserModal();

  // Get user orders
  const orders = JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];

  // Create orders modal
  const modal = document.createElement("div");
  modal.id = "orders-modal";
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: white; border-radius: 15px; padding: 30px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--cultured); padding-bottom: 15px;">
          <h2 style="margin: 0; color: var(--eerie-black); font-size: 24px;">My Orders</h2>
          <button onclick="closeOrdersModal()" style="background: none; border: none; font-size: 28px; color: var(--sonic-silver); cursor: pointer;">×</button>
        </div>
        
        <div id="orders-content">
          ${
            orders.length === 0
              ? `
            <div style="text-align: center; padding: 40px 20px; color: var(--sonic-silver);">
              <ion-icon name="receipt-outline" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></ion-icon>
              <p style="font-size: 18px; margin-bottom: 10px;">No orders yet</p>
              <p style="font-size: 14px;">Your order history will appear here after you make a purchase.</p>
            </div>
          `
              : `
            <div style="display: flex; flex-direction: column; gap: 15px;">
              ${orders
                .map(
                  (order, index) => `
                <div style="border: 1px solid var(--cultured); border-radius: 10px; padding: 20px;">
                  <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                      <h4 style="margin: 0 0 5px 0; color: var(--eerie-black);">${
                        order.name
                      }</h4>
                      <p style="margin: 0; color: var(--sonic-silver); font-size: 14px;">Quantity: ${
                        order.quantity
                      }</p>
                      <p style="margin: 5px 0 0 0; font-weight: 600; color: var(--ocean-green);">${(
                        order.price * order.quantity
                      ).toFixed(2)}</p>
                    </div>
                    <div style="text-align: right;">
                      <p style="margin: 0; color: var(--sonic-silver); font-size: 12px;">Order Date</p>
                      <p style="margin: 0; color: var(--eerie-black); font-size: 14px; font-weight: 500;">${
                        order.date
                      }</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; padding: 8px 12px; background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(255,51,102,0.1)); border-radius: 6px;">
                    <ion-icon name="checkmark-circle" style="color: var(--ocean-green); margin-right: 8px;"></ion-icon>
                    <span style="color: var(--ocean-green); font-size: 14px; font-weight: 500;">Order Completed</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
          }
        </div>
        
        <div style="margin-top: 25px; text-align: center;">
          <button onclick="closeOrdersModal()" style="padding: 12px 30px; background: linear-gradient(135deg, var(--ocean-green), var(--salmon-pink)); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500;">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeOrdersModal() {
  const modal = document.getElementById("orders-modal");
  if (modal) {
    modal.remove();
  }
}

function logoutUser() {
  // Show confirmation
  const confirmLogout = confirm("Are you sure you want to sign out?");
  if (!confirmLogout) return;

  // Clear user data
  localStorage.removeItem("loggedInUser");

  // Close any open dropdowns/modals
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) dropdown.style.display = "none";
  closeMobileUserModal();

  // Show success message
  showAlert("You have been signed out successfully!", "success");

  // Update UI
  updateUserDisplay();

  // Optionally redirect to auth page
  setTimeout(() => {
    window.location.href = "auth.html";
  }, 2000);
}

// Enhanced checkout process with user integration
function displayAdminPanel(summary) {
  const user = checkUserAuth();

  checkoutSection.style.display = "none";
  adminPanel.style.display = "block";
  const summaryDiv = document.getElementById("admin-panel-summary");

  summaryDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, var(--ocean-green), var(--salmon-pink)); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; display: flex; align-items: center;">
        <ion-icon name="checkmark-circle" style="margin-right: 10px; font-size: 24px;"></ion-icon>
        Order Confirmation
      </h3>
      <p style="margin: 0; opacity: 0.9;">Your order has been placed successfully!</p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
      <div>
        <h4 style="color: var(--eerie-black); margin-bottom: 10px;">Customer Details</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${summary.name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${summary.email}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${summary.phone}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${
          summary.address
        }</p>
      </div>
      
      <div>
        <h4 style="color: var(--eerie-black); margin-bottom: 10px;">Order Details</h4>
        <p style="margin: 5px 0;"><strong>Payment:</strong> ${
          summary.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"
        }</p>
        <p style="margin: 5px 0;"><strong>Checkout Fee:</strong> ${checkoutFee.toFixed(
          2
        )}</p>
        <p style="margin: 5px 0; color: var(--ocean-green); font-size: 18px;"><strong>Total: ${summary.totalPrice.toFixed(
          2
        )}</strong></p>
      </div>
    </div>
    
    <div style="background: var(--cultured); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
      <h4 style="color: var(--eerie-black); margin-bottom: 15px;">Purchased Items</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${summary.items
          .map(
            (item) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 8px;">
            <div>
              <span style="font-weight: 500; color: var(--eerie-black);">${
                item.name
              }</span>
              <span style="color: var(--sonic-silver); margin-left: 10px;">×${
                item.quantity
              }</span>
            </div>
            <span style="font-weight: 600; color: var(--ocean-green);">${(
              item.price * item.quantity
            ).toFixed(2)}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    
    ${
      user
        ? `
      <div style="background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(255,51,102,0.1)); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <p style="margin: 0; color: var(--eerie-black); display: flex; align-items: center;">
          <ion-icon name="person-circle" style="margin-right: 8px; color: var(--ocean-green);"></ion-icon>
          Order saved to your account history
        </p>
      </div>
    `
        : ""
    }
  `;

  // Save order history for logged in user
  if (user) {
    const existingOrders =
      JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];
    summary.items.forEach((item) => {
      existingOrders.push({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        date: new Date().toLocaleString(),
      });
    });
    localStorage.setItem(
      `orders_${user.email}`,
      JSON.stringify(existingOrders)
    );
  }

  cart = [];
  updateCounts();
  saveState();
  showAlert("Order placed successfully!", "success");
}

// Enhanced alert system with better positioning for mobile
function showAlert(message, type = "success") {
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;
  alert.innerHTML = `
    <div class="alert-content">
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    if (alert && alert.parentNode) {
      alert.remove();
    }
  }, 3000);
}

// Initialize authentication when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Update user display on page load
  updateUserDisplay();

  // Set up click handlers for user authentication
  const desktopUserBtn = document.querySelector(
    ".desktop-navigation-menu .action-btn"
  );
  const mobileUserBtn = document.querySelector(
    ".mobile-bottom-navigation .action-btn:last-child"
  );

  if (!checkUserAuth()) {
    if (desktopUserBtn && !desktopUserBtn.onclick) {
      desktopUserBtn.onclick = () => (window.location.href = "auth.html");
    }
    if (mobileUserBtn && !mobileUserBtn.onclick) {
      mobileUserBtn.onclick = () => (window.location.href = "auth.html");
    }
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".user-menu")) {
      const dropdown = document.getElementById("user-dropdown");
      if (dropdown) {
        dropdown.style.display = "none";
      }
    }
  });
});

// Add CSS styles for better user interface
const authStyles = `
  <style>
    .custom-alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 2000;
      animation: slideInRight 0.3s ease-in-out;
      max-width: 400px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .custom-alert.success {
      background: linear-gradient(135deg, #4CAF50, #45a049);
    }
    
    .custom-alert.error {
      background: linear-gradient(135deg, hsl(353, 92%, 50%), hsl(0, 97%, 27%));
    }
    
    .custom-alert.warning {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }
    
    .custom-alert.info {
      background: linear-gradient(135deg, hsl(236, 94%, 46%), hsl(353, 92%, 50%));
    }
    
    .alert-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .alert-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(300px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @media (max-width: 768px) {
      .custom-alert {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
    
    .user-dropdown button:hover {
      background-color: var(--cultured);
      border-radius: 5px;
    }
    
    .user-avatar:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
  </style>
`;

// Inject styles
document.head.insertAdjacentHTML("beforeend", authStyles);
