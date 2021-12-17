const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  if (username && password) {
    showLoader();

    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // fires get /dashboard route in homeRoutes

      document.location.replace("/dashboard");
    } else {
      hideLoader();
      document.location.replace("/login");
    }
  }

  if (!username) {
    hideLoader();
    showMessage("error_messages", "Please enter a username to login");
  } else if (!password) {
    hideLoader();
    showMessage("error_messages", "Please enter a password to login");
  }
};

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);

const passwordInput = document.querySelector("#togglePassword");
const password = document.querySelector("#password-login");
passwordInput.addEventListener("click", function (event) {
  // if the type is set as password, changes to text, if it's text, changes to password
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  // changes the eye open/slashes icon
  this.classList.toggle("bi-eye");
});
