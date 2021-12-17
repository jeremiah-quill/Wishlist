const updateGroupEventHandler = async (event) => {
  event.preventDefault();
  const event_name = document.querySelector("#event-name").value.trim();
  const price_limit = document.querySelector("#price-limit").value.trim();
  const event_date = document.querySelector("#event-date").value;
  const group_id = document
    .querySelector("#update-group-form")
    .getAttribute("data-group-id");

  const response = await fetch(`/api/groups/${group_id}`, {
    method: "PUT",
    body: JSON.stringify({ event_name, price_limit, event_date }),
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    document.location.reload(`/group/${group_id}`);
  } else {
    // alert("Failed to update group.");
  }
};

const drawNamesEventHandler = async () => {
  const group_id = document
    .querySelector("#draw-names-button")
    .getAttribute("data-group-id");

  const response = await fetch(`/api/groups/${group_id}/assign-santas`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
  });

  if (response.ok) {
    document.location.reload(`/group/${group_id}`);
  } else {
    // alert("Failed to update group.");
  }
};

// test if there is a group form rendered on the page, if there is, add the form submit event listener
if (document.querySelector("#update-group-form")) {
  document
    .querySelector("#update-group-form")
    .addEventListener("submit", updateGroupEventHandler);
}

// test if there is a draw names button rendered on the page, if there is, add the event listener for drawing names
if (document.querySelector("#draw-names-button")) {
  document.querySelector("#draw-names-button").addEventListener("click", () => {
    drawNamesEventHandler();
  });
}

// COUNTDOWN TIMER //
const groupDate = document
  .querySelector(".group-date-holder")
  .getAttribute("data-group-date");
const groupName = document.querySelector(".group-page-title").innerHTML;

var end = new Date(groupDate);

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
  var now = new Date();
  var distance = end - now;
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "HAVE FUN!";

    return;
  }
  var days = Math.floor(distance / _day);
  // ADDED 5 HOURS TO TIME BECAUSE CAN'T FIGURE OUT HOW TO CONFIGURE SEQUELIZE TO NOT BE IN UTC/GMT
  var hours = Math.floor((distance % _day) / _hour) + 5;
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);

  document.getElementById("countdown").innerHTML = days + " days,  ";
  document.getElementById("countdown").innerHTML += hours + " hrs,  ";
  document.getElementById("countdown").innerHTML += minutes + " mins,  ";
  document.getElementById("countdown").innerHTML += seconds + " secs, ";
  document.getElementById("countdown").innerHTML += ` until ${groupName}`;
}

timer = setInterval(showRemaining, 1000);
