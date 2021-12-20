const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  if (email && username && password) {
    showLoader();
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      hideLoader();
      document.location.replace("/signup");
    }
    // user did not enter an email
  } else if (!email) {
    hideLoader();
    showMessage("error_messages", "Please enter an email to complete sign up");
    // user did not enter a username
  } else if (!username) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a username to complete sign up"
    );
    // user did not enter a password
  } else if (!password) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a password to complete sign up"
    );
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);


  // duplicate code.  create a util function that does this and call it here and in signUp.js
const passwordInput = document.querySelector("#togglePassword");
const password = document.querySelector("#password-signup");
passwordInput.addEventListener("click", function (event) {
  // if the type is set as password, changes to text, if it's text, changes to password
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  // toggle the eye / eye slash icon
  this.classList.toggle("bi-eye");
});
