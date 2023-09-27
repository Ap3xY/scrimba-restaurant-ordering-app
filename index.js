import { menuArray } from "./data.js";

const itemContainer = document.getElementById("item-container");
const orderContainer = document.getElementById("order");
const totalElement = document.getElementById("total");

let total = 0; // Initialize total price
let orderList = {}; // Initialize an object to keep track of ordered items

menuArray.forEach(function (item) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

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
    if (orderList[item.id]) {
      orderList[item.id].quantity += 1; // Increase the quantity count
    } else {
      orderList[item.id] = {
        name: item.name,
        price: item.price,
        quantity: 1,
      };
    }

    // Redraw the order list
    renderOrderList();

    // Accumulate the total price
    total += item.price;

    // Update the #total div
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  });

  itemContainer.appendChild(itemDiv);
});

function renderOrderList() {
  orderContainer.innerHTML = ""; // Clear the existing order list
  for (let itemId in orderList) {
    const orderedItemDiv = document.createElement("div");
    orderedItemDiv.classList.add("ordered-item");

    orderedItemDiv.innerHTML = `
      <p>${orderList[itemId].name} x ${orderList[itemId].quantity} <a href="#" class="remove-item" data-id="${itemId}">Remove</a></p>
    `;

    // Add event listener to the "remove item" link
    orderedItemDiv
      .querySelector(".remove-item")
      .addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default action of the link
        const id = event.target.getAttribute("data-id");

        // Decrease the quantity or remove the item from orderList
        if (orderList[id].quantity > 1) {
          orderList[id].quantity -= 1;
          total -= orderList[id].price;
        } else {
          total -= orderList[id].price * orderList[id].quantity;
          delete orderList[id];
        }

        // Update the #total div
        totalElement.textContent = `Total: $${total.toFixed(2)}`;

        // Re-render the order list
        renderOrderList();
      });

    orderContainer.appendChild(orderedItemDiv);
  }
}

const completeOrderButton = document.getElementById("completeOrderButton");
const paymentModal = document.getElementById("paymentModal");
const payButton = document.getElementById("payButton");

completeOrderButton.addEventListener("click", function () {
  if (Object.keys(orderList).length === 0) {
    // Check if orderList is empty
    alert("Please add items to your order before checking out.");
    return;
  }
  paymentModal.style.display = "block";
});

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

  const userName = document.getElementById("name").value;
  document.getElementById(
    "confirmationMessage"
  ).textContent = `Thank You, ${userName}! Your order is on its way.`;

  paymentModal.style.display = "none"; // Hide the payment modal
  document.getElementById("confirmationModal").style.display = "flex"; // Show the confirmation modal
});

// Add an event listener for the close button of the confirmation modal
document
  .getElementById("closeConfirmation")
  .addEventListener("click", function () {
    // Hide the confirmation modal
    document.getElementById("confirmationModal").style.display = "none";

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
    paymentModal.style.display = "none";
  }
});
