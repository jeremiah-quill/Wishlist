// Add gift to wishlist
const addItemEventHandler = async (event) => {
  event.preventDefault();
  const gift_name = document.querySelector("#add-gift-name").value.trim();
  const price = document.querySelector("#add-gift-price").value;
  const gift_link = document.querySelector("#add-gift-link").value.trim();

  if (gift_name && price && gift_link) {
    const response = await fetch("/api/gifts", {
      method: "POST",
      body: JSON.stringify({ gift_name, price, gift_link }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      alert("Failed to add new item.");
    }
  }
  if (!gift_name) {
    alert("Please enter a gift name");
  } else if (!price) {
    alert("Please enter a price");
  } else if (!gift_link) {
    alter("please enter a link for this gift");
  }
};

// Delete gift from wishlist
const deleteItemEventHandler = async (event) => {
  const item = event.target.parentElement.parentElement;

  const itemId = item.getAttribute("data-gift-id");

  const response = await fetch(`/api/gifts/${itemId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    document.location.reload(`/dashboard`);
  } else {
    alert("Failed to delete item.");
  }
};

// when you click edit gift button, it gets all details for that gift based on the data id and sets a data gift id on the edit gift form in the modal
const getEditItemDetails = async (event) => {
  const item = event.target.parentElement.parentElement;

  const itemId = item.getAttribute("data-gift-id");

  const response = await fetch(`/api/gifts/${itemId}`, {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    let res = await response.json();

    document.querySelector("#edit-gift-name").value = res.gift_name;
    document.querySelector("#edit-gift-price").value = res.price;
    document.querySelector("#edit-gift-link").value = res.gift_link;
    // document
    //   .querySelector("#edit-gift-form")
    //   .setAttribute("data-gift-id", res.id);

    const updateItemEventHandler = async (event) => {
      event.preventDefault();
      // TODO: add input id/class to querySelector
      const gift_name = document.querySelector("#edit-gift-name").value.trim();
      const price = document.querySelector("#edit-gift-price").value.trim();
      const gift_link = document.querySelector("#edit-gift-link").value.trim();

      // const item = document.querySelector("#edit-gift-form");

      const response = await fetch(`/api/gifts/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ gift_name, price, gift_link }),
        headers: { "Content-type": "application/json" },
      });

      if (response.ok) {
        document.location.reload(`/dashboard`);
      } else {
        alert("Failed to update item.");
      }
    };

    document
      .querySelector("#edit-gift-form")
      .addEventListener("submit", updateItemEventHandler);
  } else {
    alert("Failed to delete item.");
  }
};

// uses data gift id property in edit gift form in model to edit the corresponding gift on submit

// Event listeners
document
  .querySelector(".add-gift-form")
  .addEventListener("submit", addItemEventHandler);

document.querySelector("body").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    deleteItemEventHandler(e);
  }
});

document.querySelector("body").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    getEditItemDetails(e);
  }
});
