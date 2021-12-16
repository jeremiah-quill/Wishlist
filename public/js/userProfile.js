const updateProfileEventHandler = async (event) => {
  event.preventDefault();

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

document.querySelector("#email-username-form").addEventListener("submit", updateProfileEventHandler);

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
  .querySelector("#password-form")
  .addEventListener("submit", updatePasswordEventHandler);


const passwordForm = document.querySelector("#password-form");

passwordForm.addEventListener("click", function (event) {
  console.log(event.target)
  console.log(event.target.previousElementSibling)
  // if the type is set as password, changes to text, if it's text, changes to password
  if(event.target.classList.contains("bi-eye-slash")){
  const type = event.target.previousElementSibling.getAttribute("type") === "password" ? "text" : "password";
  event.target.previousElementSibling.setAttribute("type", type);
  // toggle the eye / eye slash icon
  event.target.classList.toggle("bi-eye");
  }
});