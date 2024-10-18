"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let cartCount = 0;
  let cartTable = []; // List of product
  let cartCountElement = document.getElementById("cart-count");
  let addToCartButtons = document.querySelectorAll(".btn-add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Products Information
      let productCard = e.target.closest(".card");
      let productName = productCard.querySelector(".card-title").textContent;
      let productPrice = productCard.querySelector(".card-text").textContent;
      let productImgSrc = productCard.querySelector("img").src;

      //Increase the number of products
      cartCount++;
      cartCountElement.textContent = cartCount;

      // Add product in table
      let product = {
        name: productName,
        price: parseFloat(productPrice.replace("$", "")),
        image: productImgSrc,
        quantity: 1,
      };
      cartTable.push(product);

      // Save the information of cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartTable));

      // Update the shopping cart
      displayCartItems();
    });
  });

  // Showing products in shopping carts
  function displayCartItems() {
    let cartTableBody = document.getElementById("cartBody");
    cartTableBody.innerHTML = "";
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let totalAmountElement = document.getElementById("totalAmount");

    if (cartItems.length > 0) {
      cartItems.forEach((item, index) => {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td><img src="${item.image}" alt="${
          item.name
        }" class="products-img"></td>
          <td>${item.name}</td>
          <td>
            <div class="qty-container">
              <button class="btn btn-outline-secondary btn-sm btn-minus" data-index="${index}">-</button>
              <input type="text" class="form-control qty-input" value="${
                item.quantity
              }" readonly />
              <button class="btn btn-outline-secondary btn-sm btn-plus" data-index="${index}">+</button>
            </div>
          </td>
          <td><input type="text" class="form-control price-input" value="${
            item.price
          }" readonly /></td>
          <td class="amount" data-index="${index}">$${(
          item.price * item.quantity
        ).toFixed(2)}</td>
        `;
        cartTableBody.appendChild(newRow);
      });

      // Manage the number of product
      document.querySelectorAll(".btn-minus").forEach((button) => {
        button.addEventListener("click", function () {
          let index = button.getAttribute("data-index");
          if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
          } else {
            cartItems.splice(index, 1);
          }
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          displayCartItems();
        });
      });

      document.querySelectorAll(".btn-plus").forEach((button) => {
        button.addEventListener("click", function () {
          let index = button.getAttribute("data-index");
          cartItems[index].quantity++;
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          displayCartItems();
        });
      });

      // Update total amount
      updateTotalAmount(cartItems);
    } else {
      cartTableBody.innerHTML =
        "<tr><td colspan='5'>No Product here...</td></tr>";
      totalAmountElement.textContent = "TOTAL = $0.00";
    }
  }

  function updateTotalAmount(cartItems) {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    let totalAmountElement = document.getElementById("totalAmount");
    totalAmountElement.textContent = `TOTAL = $${total.toFixed(2)}`;
  }

  displayCartItems();
});
