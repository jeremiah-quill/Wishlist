const addItemEventHandler = async (event) => {
  event.preventDefault();
  // TODO: add input id/class to querySelector
  const item = document.querySelector("").value.trim();
  // TODO: add element with data-id attribute's id/class to querySelector
  const profile = document.querySelector("");
  const userId = profile.getAttribute("data-id");

  if (item) {
    const response = await fetch("/api/gifts", {
      method: "POST",
      body: JSON.stringify({ item }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/${userId}`);
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
  const item = document.querySelector("").value.trim();
  // TODO: add element with data-id attribute's id/class to querySelector
  const profile = document.querySelector("");
  const userId = profile.getAttribute("data-id");
  const item = document.querySelector("");
  const itemId = item.getAttribute("data-id");

  if (item) {
    const response = await fetch(`/api/gifts/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ item }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/${userId}`);
    } else {
      alert("Failed to update item.");
    }
  }
};
// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", updateItemEventHandler);


const addItemEventHandler = async (event) => {
  event.preventDefault();
  // TODO: add element with data-id attribute's id/class to querySelector
  const profile = document.querySelector("");
  const userId = profile.getAttribute("data-id");
  const item = document.querySelector("");
  const itemId = item.getAttribute("data-id");

  const response = await fetch(`/api/gifts/${itemId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    document.location.reload(`/${userId}`);
  } else {
    alert("Failed to delete item.");
  }
};

// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", addItemEventHandler);
