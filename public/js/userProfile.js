const updateProfileEventHandler = async (event) => {
  event.preventDefault();

  // TODO: add input id/class to querySelector
  const username = document.querySelector("#input-username").value.trim();
  const email = document.querySelector("#input-email").value.trim();

  if (username && email) {
    const response = await fetch("api/users/profile", {
      method: "PUT",
      body: JSON.stringify({ username, email }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      alert("Failed to update profile.");
    }
  }
};
// TODO: add form id/class to querySelector
document.querySelector("").addEventListener("submit", updateProfileEventHandler);

const updatePasswordEventHandler = async (event) => {
  event.preventDefault();

  const newPassword = document.querySelector("#input-new-password-1").value.trim();
  const confirmNewPassword = document.querySelector("#input-new-password-2").value.trim();

  if (newPassword === confirmNewPassword) {
    const response = await fetch("api/users/password", {
      method: "PUT",
      body: JSON.stringify({ new_password: confirmNewPassword }),
      headers: { "Content-type": "application/json" },
    });

    if (response.ok) {
      document.location.reload(`/dashboard`);
    } else {
      alert("Failed to update password.");
    }
  }
};
// TODO: add form id/class to querySelector
document
  .querySelector("")
  .addEventListener("submit", updatePasswordEventHandler);


// const passwordInput = document.querySelector("#togglePassword");
// const passwordInput1 = document.querySelector("#input-current-password");
// const passwordInput2 = document.querySelector("#input-new-password-1");
// const passwordInput3 = document.querySelector("#input-new-password-2");

// passwordInput.addEventListener("click", function (event) {
//   // if the type is set as password, changes to text, if it's text, changes to password
//   const type = passwordInput1.getAttribute("type") === "password" ? "text" : "password";
//   passwordInput1.setAttribute("type", type);
//   // toggle the eye / eye slash icon
//   this.classList.toggle("bi-eye");
// });
// passwordInput.addEventListener("click", function (event) {
//   // if the type is set as password, changes to text, if it's text, changes to password
//   const type = passwordInput2.getAttribute("type") === "password" ? "text" : "password";
//   passwordInput2.setAttribute("type", type);
//   // toggle the eye / eye slash icon
//   this.classList.toggle("bi-eye");
// });
// passwordInput.addEventListener("click", function (event) {
//   // if the type is set as password, changes to text, if it's text, changes to password
//   const type = passwordInput3.getAttribute("type") === "password" ? "text" : "password";
//   passwordInput3.setAttribute("type", type);
//   // toggle the eye / eye slash icon
//   this.classList.toggle("bi-eye");
// });