const updateProfileEventHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#input-username").value.trim();
  const email = document.querySelector("#input-email").value.trim();

  if (username && email) {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify({ username, email }),
      headers: { "Content-type": "application/json" },
    });
    console.log(response);
    if (response.ok) {
      document.location.replace("/dashboard/profile");
    } else {
      document.location.replace("/dashboard/profile");
    }
  } else {
    showMessage("error_messages", "Please provide both a username and email!");
  }
};

document
  .querySelector("#email-username-form")
  .addEventListener("submit", updateProfileEventHandler);

const updatePasswordEventHandler = async (event) => {
  event.preventDefault();

  const currentPassword = document
    .querySelector("#input-current-password")
    .value.trim();
  const newPassword = document
    .querySelector("#input-new-password-1")
    .value.trim();
  const confirmNewPassword = document
    .querySelector("#input-new-password-2")
    .value.trim();

  if (newPassword === confirmNewPassword) {
    showLoader();

    const response = await fetch("/api/users/password", {
      method: "PUT",
      body: JSON.stringify({
        new_password: confirmNewPassword,
        password: currentPassword,
      }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard/profile");
      hideLoader();
    } else {
      // already runs on back-end
      // showMessage("error_messages", "Current Password input incorrect.");
      document.location.replace("/dashboard/profile");
    }
  } else {
    hideLoader();
    showMessage("error_messages", "New passwords did not match!");
  }
};
document
  .querySelector("#password-form")
  .addEventListener("submit", updatePasswordEventHandler);

const passwordForm = document.querySelector("#password-form");

// duplicate code.  create a util function that does this and call it here and in signUp.js
passwordForm.addEventListener("click", function (event) {
  // if the type is set as password, changes to text, if it's text, changes to password
  if (event.target.classList.contains("bi-eye-slash")) {
    const type =
      event.target.previousElementSibling.getAttribute("type") === "password"
        ? "text"
        : "password";
    event.target.previousElementSibling.setAttribute("type", type);
    // toggle the eye / eye slash icon
    event.target.classList.toggle("bi-eye");
  }
});
