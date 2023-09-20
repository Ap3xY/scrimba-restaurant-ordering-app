import { menuArray } from "./data.js";

const itemContainer = document.getElementById("item-container");
const addItem = document.getElementById("add-item");

menuArray.forEach(function (item) {
  itemContainer.innerHTML += `
    <div class="item">
        <div class="item-details">
            <p id="emoji">${item.emoji}</p>
        <div class="item-text">
        <h3 id="item-name">${item.name}</h3>
        <p id="item-ingredients">${item.ingredients.join(", ")}</p>
        <p id="item-price">$${item.price}</p>
        </div>
        </div>
        <i id="add-item" class="fa-solid fa-plus"></i>
    </div>
`;
});
