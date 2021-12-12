const joinGroupFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const group_id = document.querySelector("#group-id-login").value.trim();
  const group_password = document
    .querySelector("#group-password-login")
    .value.trim();
  if (group_id && group_password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/groups/join", {
      method: "POST",
      body: JSON.stringify({ group_id, group_password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // fires get /group/:id route in homeRoutes
      document.location.replace(`/group/${group_id}`);
    } else {
      let res = await response.json();
      // TODO: Configure error message
      // errorMessage(res.message);
      alert(res.message);
    }
  }

  if (!group_id) {
    // TODO: Configure error message
    // errorMessage("Please enter a group id to join a group");
    alert("Please enter a group id to join a group");
  } else if (!group_password) {
    // TODO: Configure error message
    // errorMessage("Please enter group password to join a group");
    alert("Please enter a group password to join a group");
  }
};

document
  .querySelector(".join-group-form")
  .addEventListener("submit", joinGroupFormHandler);
