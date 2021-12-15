const toggleSpinner = () => {
  let spinner = document.querySelector(".spinner");
  if (spinner.classList.contains("show-spinner")) {
    spinner.classList.remove("show-spinner");
  } else {
    spinner.classList.add("show-spinner");
  }
};
