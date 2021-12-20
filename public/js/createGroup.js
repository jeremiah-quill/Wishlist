const createGroupFormHandler = async (event) => {
  event.preventDefault();

  const event_name = document.querySelector("#event-name").value.trim();
  const price_limit = document.querySelector("#price-limit").value.trim();
  const event_date = document.querySelector("#event-date").value;
  const group_password = document.querySelector("#group-password").value.trim();

  if (event_name && price_limit && event_date && group_password) {
    showLoader();
    const response = await fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify({
        event_name,
        price_limit,
        event_date,
        group_password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const res = await response.json();
      document.location.replace(`/group/${res.group_id}`);
    } else {
      document.location.replace("/create-group");
    }
    // handle missing group name
  } else if (!event_name) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter an event name to create a group"
    );
    // handle missing price limit
  } else if (!price_limit) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a price limit to create a group"
    );
    // handle missing event date
  } else if (!event_date) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter an event date to create a group"
    );
    // handle missing password
  } else if (!group_password) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a group password to create a group"
    );
  }
};

document
  .querySelector(".create-group-form")
  .addEventListener("submit", createGroupFormHandler);
