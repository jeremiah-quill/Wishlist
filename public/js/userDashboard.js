// Add gift to wishlist
const addItemEventHandler = async (event) => {
  event.preventDefault();
  const gift_name = document.querySelector("#add-gift-name").value.trim();
  const price = document.querySelector("#add-gift-price").value;
  const gift_link = document.querySelector("#add-gift-link").value.trim();

  if (gift_name) {
    console.log(gift_link);
    const response = await fetch("/api/gifts", {
      method: "POST",
      body: JSON.stringify({ gift_name, price, gift_link }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      // alert("Failed to add new item.");
      // req.flash("error_messages", "Failed to add gift 3.");
      document.location.reload(`/dashboard`);
    }
  }
  if (!gift_name) {
    // document.location.reload("/dashboard");

    showMessage("error_messages", "Please enter a gift name");
  }
  // else if (!gift_link) {
  //   showMessage("error_messages", "Please enter a link for this gift");
  // }
};

// Delete gift from wishlist
const deleteItemEventHandler = async (event) => {
  // const item = event.target.parentElement.parentElement;

  const itemId = event.target.getAttribute("data-gift-id");

  const response = await fetch(`/api/gifts/${itemId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    document.location.reload(`/dashboard`);
  } else {
    // alert("Failed to delete item.");
  }
};

// when you click edit gift button, it gets all details for that gift based on the data id and sets a data gift id on the edit gift form in the modal
const getEditItemDetails = async (event) => {
  const itemId = event.target.getAttribute("data-gift-id");

  const response = await fetch(`/api/gifts/${itemId}`, {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    let res = await response.json();

    document.querySelector("#edit-gift-name").value = res.gift_name;
    document.querySelector("#edit-gift-price").value = res.price;
    document.querySelector("#edit-gift-link").value = res.gift_link;

    const updateItemEventHandler = async (event) => {
      event.preventDefault();
      const gift_name = document.querySelector("#edit-gift-name").value.trim();
      const price = document.querySelector("#edit-gift-price").value.trim();
      const gift_link = document.querySelector("#edit-gift-link").value.trim();

      if (gift_name) {
        const response = await fetch(`/api/gifts/${itemId}`, {
          method: "PUT",
          body: JSON.stringify({ gift_name, price, gift_link }),
          headers: { "Content-type": "application/json" },
        });

        if (response.ok) {
          document.location.reload(`/dashboard`);
        }
      } else if (!gift_name) {
        showMessage(
          "error_message",
          "Please provide a gift name to finish updating"
        );
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

// COUNTDOWN TIMER //
var end = new Date("12/25/2021 12:00 AM");

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
  var now = new Date();
  var distance = end - now;
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "MERRY CHRISTMAS!";

    return;
  }
  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);

  document.getElementById("countdown").innerHTML = days + " days,  ";
  document.getElementById("countdown").innerHTML += hours + " hrs,  ";
  document.getElementById("countdown").innerHTML += minutes + " mins,  ";
  document.getElementById("countdown").innerHTML += seconds + " secs, ";
  document.getElementById("countdown").innerHTML += " until Christmas!";
}

timer = setInterval(showRemaining, 1000);
