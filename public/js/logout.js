const logout = async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

    document.location.replace("/");
 
};

document.querySelector("#logout").addEventListener("click", logout);
