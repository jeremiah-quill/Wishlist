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
      // fires get /dashboard route in homeRoutes
      document.location.replace("/dashboard");
    } else {
      let res = await response.json();
      // TODO: configure errorMessage
      // errorMessage(res.message);
      hideLoader();

      // alert(`${res.message}`);
    }
  } else if (!email) {
    // TODO: configure errorMessage
    // errorMessage("Please enter an email to sign up");
    hideLoader();
    showMessage("error_messages", "Please enter an email to complete sign up");
  } else if (!username) {
    // TODO: configure errorMessage
    // errorMessage("Please enter a username to sign up");
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a username to complete sign up"
    );
  } else {
    // TODO: configure errorMessage
    // errorMessage("Please enter a password to sign up");
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
