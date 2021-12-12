const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  if (email && username && password) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // fires get /dashboard route in homeRoutes
      document.location.replace("/dashboard");
    } else {
      console.log(response);
      let res = await response.json();
      // TODO: configure errorMessage
      // errorMessage(res.message);
      alert(`${res.message} on line 22`);
    }
  } else if (!email) {
    // TODO: configure errorMessage
    // errorMessage("Please enter an email to sign up");
    alert("please enter an email to sign up");
  } else if (!username) {
    // TODO: configure errorMessage
    // errorMessage("Please enter a username to sign up");
    alert("please enter a username to sign up");
  } else {
    // TODO: configure errorMessage
    // errorMessage("Please enter a password to sign up");
    alert("please enter a password to sign up");
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);
