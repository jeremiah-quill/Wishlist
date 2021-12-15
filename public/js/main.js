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
