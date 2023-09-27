import { menuArray } from "./data.js"; // Importing menu items from data.js

// Check if menuArray is valid and not empty
if (!Array.isArray(menuArray) || menuArray.length === 0) {
  console.error("menuArray is not a valid array or is empty");
  throw new Error("Invalid menu data");
}

// Get DOM elements and check if they exist
const itemContainer = document.getElementById("item-container");
const orderContainer = document.getElementById("order");
const totalElement = document.getElementById("total");

if (!itemContainer || !orderContainer || !totalElement) {
  console.error("One or more required DOM elements are missing");
  throw new Error("Missing DOM elements");
}

let total = 0; // Initialize total price
let orderList = {}; // Initialize an object to keep track of ordered items

// Iterate over menu items and create item elements
menuArray.forEach(function (item) {
  // Validate item properties
  if (
    !item ||
    !item.id ||
    !item.name ||
    !item.price ||
    !item.ingredients ||
    !item.emoji
  ) {
    console.warn("Invalid item data:", item);
    return; // Skip this iteration if item data is invalid
  }

  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  // Set itemDiv innerHTML with item details
  itemDiv.innerHTML = `
    <div class="item-details">
        <p class="emoji">${item.emoji}</p>
        <div class="item-text">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-ingredients">${item.ingredients.join(", ")}</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
        </div>
    </div>
    <i class="add-item fa-solid fa-plus"></i>
  `;

  // Add event listener to the "add item" icon
  itemDiv.querySelector(".add-item").addEventListener("click", function () {
    // Update orderList with selected item
    if (orderList[item.id]) {
      orderList[item.id].quantity += 1; // Increase the quantity count
    } else {
      orderList[item.id] = {
        name: item.name,
        price: item.price,
        quantity: 1,
      };
    }

    renderOrderList(); // Redraw the order list
    total += item.price; // Accumulate the total price
    totalElement.textContent = `Total: $${total.toFixed(2)}`; // Update the #total div
  });

  itemContainer.appendChild(itemDiv); // Append itemDiv to itemContainer
});

// Function to render the order list
function renderOrderList() {
  orderContainer.innerHTML = ""; // Clear the existing order list
  for (let itemId in orderList) {
    // Iterate over orderList items
    const orderedItemDiv = document.createElement("div");
    orderedItemDiv.classList.add("ordered-item");

    // Set orderedItemDiv innerHTML with ordered item details
    orderedItemDiv.innerHTML = `
      <p>${orderList[itemId].name} x ${orderList[itemId].quantity} <a href="#" class="remove-item" data-id="${itemId}">Remove</a></p>
    `;

    // Add event listener to the "remove item" link
    orderedItemDiv
      .querySelector(".remove-item")
      .addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default action of the link
        const id = event.target.getAttribute("data-id"); // Get item id from data-id attribute

        // Decrease the quantity or remove the item from orderList
        if (orderList[id].quantity > 1) {
          orderList[id].quantity -= 1;
          total -= orderList[id].price;
        } else {
          total -= orderList[id].price * orderList[id].quantity;
          delete orderList[id];
        }

        totalElement.textContent = `Total: $${total.toFixed(2)}`; // Update the #total div
        renderOrderList(); // Re-render the order list
      });

    orderContainer.appendChild(orderedItemDiv); // Append orderedItemDiv to orderContainer
  }
}

// Get completeOrderButton, paymentModal, and payButton elements and check if they exist
const completeOrderButton = document.getElementById("completeOrderButton");
const paymentModal = document.getElementById("paymentModal");
const payButton = document.getElementById("payButton");

if (!completeOrderButton || !paymentModal || !payButton) {
  console.error("One or more required DOM elements are missing");
  throw new Error("Missing DOM elements");
}

// Add event listener to completeOrderButton
completeOrderButton.addEventListener("click", function () {
  if (Object.keys(orderList).length === 0) {
    // Check if orderList is empty
    alert("Please add items to your order before checking out.");
    return;
  }
  paymentModal.style.display = "block"; // Show paymentModal
});

// Add event listener to payButton
payButton.addEventListener("click", function () {
  // Get all input fields in the modal
  const inputs = paymentModal.querySelectorAll("input");

  // Check each input to ensure it has a value
  for (let input of inputs) {
    if (!input.value.trim()) {
      // .trim() ensures that only spaces aren't considered as a valid value
      alert("Please fill in all the fields.");
      return; // Don't proceed with payment
    }
  }

  const userName = document.getElementById("name").value; // Get user name from input field
  document.getElementById(
    "confirmationMessage"
  ).textContent = `Thank You, ${userName}! Your order is on its way.`; // Set confirmation message

  paymentModal.style.display = "none"; // Hide the payment modal
  document.getElementById("confirmationModal").style.display = "flex"; // Show the confirmation modal
});

// Add an event listener for the close button of the confirmation modal
document
  .getElementById("closeConfirmation")
  .addEventListener("click", function () {
    document.getElementById("confirmationModal").style.display = "none"; // Hide the confirmation modal

    // Clear the selected items and total
    orderContainer.innerHTML = "";
    totalElement.textContent = "";

    // Clear the payment modal's input fields
    document.getElementById("name").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("cvv").value = "";

    // Reset the order list and total
    orderList = {}; // Reset the order list
    total = 0; // Reset the total
  });

// Close modal when clicked outside of modal content
window.addEventListener("click", function (event) {
  if (event.target === paymentModal) {
    paymentModal.style.display = "none"; // Hide paymentModal if clicked outside of modal content
  }
});
