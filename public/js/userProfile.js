const updateProfileEventHandler = async (event) => {
  event.preventDefault();

  // TODO: add input id/class to querySelector
  const username = document.querySelector("").value.trim();
  const email = document.querySelector("").value.trim();
  // TODO: add element with data-id attribute's id/class to querySelector
  const profile = document.querySelector("");
  const userId = profile.getAttribute("data-id");

  if (username && email) {
    const response = await fetch("api/users/profile", {
      method: "PUT",
      body: JSON.stringify({ username, email }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/${userId}`);
    } else {
      alert("Failed to update profile.");
    }
  }
};
// TODO: add form id/class to querySelector
document
  .querySelector("")
  .addEventListener("submit", updateProfileEventHandler);

  
const updatePasswordEventHandler = async (event) => {
  event.preventDefault();
  // TODO: add element with data-id attribute's id/class to querySelector
  const profile = document.querySelector("");
  const userId = profile.getAttribute("data-id");

  const password = document.querySelector("").value.trim();

  if (username && email) {
    const response = await fetch("api/users/password", {
      method: "PUT",
      body: JSON.stringify({ password }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/${userId}`);
    } else {
      alert("Failed to update password.");
    }
  }
};
// TODO: add form id/class to querySelector
document
  .querySelector("")
  .addEventListener("submit", updatePasswordEventHandler);
