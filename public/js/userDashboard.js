const addItemEventHandler = async (event) => {
  event.preventDefault();
  // TODO: add input id/class to querySelector
  const gift_name = document.querySelector("").value.trim();
  const price = document.querySelector("").value.trim();
  const gift_link = document.querySelector("").value.trim();

  if (item) {
    const response = await fetch("/api/gifts", {
      method: "POST",
      body: JSON.stringify({ gift_name, price, gift_link, user_id }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      alert("Failed to add new item.");
    }
  }
  if (!item) {
    alert("Please enter an item");
  }
};
// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", addItemEventHandler);

const updateItemEventHandler = async (event) => {
  event.preventDefault();
  // TODO: add input id/class to querySelector
  const gift_name = document.querySelector("").value.trim();
  const price = document.querySelector("").value.trim();
  const gift_link = document.querySelector("").value.trim();
  const user_id = document.querySelector("").value.trim();

  const item = document.querySelector("");
  const itemId = item.getAttribute("data-id");

  if (item) {
    const response = await fetch(`/api/gifts/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ gift_name, price, gift_link, user_id }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      alert("Failed to update item.");
    }
  }
};
// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", updateItemEventHandler);

const deleteItemEventHandler = async (event) => {
  event.preventDefault();

  const item = document.querySelector("");
  const itemId = item.getAttribute("data-id");

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

// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", deleteItemEventHandler);
