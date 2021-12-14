const createGroupFormHandler = async (event) => {
  event.preventDefault();

  // event_name: req.body.event_name,
  // price_limit: req.body.price_limit,
  // event_date: req.body.event_date,
  // creator_id: req.session.user_id,
  // group_password: req.body.group_password,

  const event_name = document.querySelector("#event-name").value.trim();
  const price_limit = document.querySelector("#price-limit").value.trim();
  const event_date = document.querySelector("#event-date").value;
  const group_password = document.querySelector("#group-password").value.trim();

  if (event_name && price_limit && event_date && group_password) {
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
      // fires get /dashboard route in homeRoutes
      const res = await response.json();
      console.log(res);
      document.location.replace(`/group/${res.group_id}`);
    } else {
      let res = await response.json();
      // TODO: configure errorMessage
      // errorMessage(res.message);
      alert(`${res.message}`);
    }
  } else if (!event_name) {
    // TODO: configure errorMessage
    // errorMessage("Please enter an email to sign up");
    alert("please enter an event anme to create a group");
  } else if (!price_limit) {
    // TODO: configure errorMessage
    // errorMessage("Please enter a username to sign up");
    alert("please enter a price limit to create a group");
  } else if (!event_date) {
    // TODO: configure errorMessage
    // errorMessage("Please enter a username to sign up");
    alert("please enter an event date to create a group");
  } else if (!group_password) {
    // TODO: configure errorMessage
    // errorMessage("Please enter a username to sign up");
    alert("please enter a group password to create a group");
  }
};

document
  .querySelector(".create-group-form")
  .addEventListener("submit", createGroupFormHandler);
