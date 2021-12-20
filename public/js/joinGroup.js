const joinGroupFormHandler = async (event) => {
  event.preventDefault();

  const group_id = document.querySelector("#group-id-login").value.trim();
  const group_password = document
    .querySelector("#group-password-login")
    .value.trim();
  const is_get_reminder = document.querySelector("#group-get-reminder").checked;

  if (group_id && group_password) {
    showLoader();
    // Send a POST request to the API endpoint
    const response = await fetch("/api/groups/join", {
      method: "POST",
      body: JSON.stringify({ group_id, group_password, is_get_reminder }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace(`/group/${group_id}`);
    } else {
      document.location.reload(`/join-group`);
    }
  } else if (!group_id) {
    hideLoader();
    showMessage("error_messages", "Please enter a group id to join a group");
  } else if (!group_password) {
    hideLoader();
    showMessage(
      "error_messages",
      "Please enter a group password to join a group"
    );
  }
};

document
  .querySelector(".join-group-form")
  .addEventListener("submit", joinGroupFormHandler);
