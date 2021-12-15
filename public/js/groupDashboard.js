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
    alert("Failed to update group.");
  }
};

const drawNamesEventHandler = async (event) => {
  event.preventDefault();

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
    alert("Failed to update group.");
  }
};

document
  .querySelector("#update-group-form")
  .addEventListener("submit", updateGroupEventHandler);

document
  .querySelector("#draw-names-button")
  .addEventListener("click", drawNamesEventHandler);
