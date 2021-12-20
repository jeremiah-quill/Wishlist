// hide loader whenever the page refreshes
window.onload = function WindowLoad(event) {
  hideLoader();
};

let loader = document.querySelector(".loader");
let goldOverlay = document.querySelector(".gold-overlay");

const showLoader = () => {
  loader.classList.add("show-loader");
  goldOverlay.classList.add("show-overlay");
};

const hideLoader = () => {
  loader.classList.remove("show-loader");
  goldOverlay.classList.remove("show-overlay");
};

// handles fade in and fade out of success messages from back end notifications
document.addEventListener("DOMContentLoaded", () => {
  let successMessage = document.querySelector(".success-messages");

  if (successMessage.innerText !== "") {
    successMessage.classList.remove("message-fade-out");
    successMessage.classList.add("message-fade");

    setTimeout(() => {
      successMessage.classList.remove("message-fade");
      successMessage.classList.add("message-fade-out");
    }, 3000);

    setTimeout(() => {
      successMessage.innerText = "";
    }, 4000);
  }
});

// handles fade in and fade out of error messages from back end notifications
document.addEventListener("DOMContentLoaded", () => {
  let errorMessage = document.querySelector(".error-messages");

  if (errorMessage.innerText !== "") {
    errorMessage.classList.remove("message-fade-out");
    errorMessage.classList.add("message-fade");

    setTimeout(() => {
      errorMessage.classList.remove("message-fade");
      errorMessage.classList.add("message-fade-out");
    }, 3000);

    setTimeout(() => {
      errorMessage.innerText = "";
    }, 4000);
  }
});

// handles fade in and fade out of all messages sent from client side (missing inputs in forms)
const showMessage = (type, message) => {
  if (type === "error_messages") {
    let errorMessage = document.querySelector(".error-messages");
    errorMessage.innerText = message;
    errorMessage.classList.remove("message-fade-out");
    errorMessage.classList.add("message-fade");

    setTimeout(() => {
      errorMessage.classList.remove("message-fade");
      errorMessage.classList.add("message-fade-out");
    }, 3000);

    setTimeout(() => {
      errorMessage.innerText = "";
    }, 4000);
  } else {
    let successMessage = document.querySelector(".success-messages");
    successMessage.innerText = message;
    successMessage.classList.remove("message-fade-out");
    successMessage.classList.add("message-fade");

    setTimeout(() => {
      successMessage.classList.remove("message-fade");
      successMessage.classList.add("message-fade-out");
    }, 3000);

    setTimeout(() => {
      successMessage.innerText = "";
    }, 4000);
  }
};
