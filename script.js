function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "Tamdeen" && pass === "T@mdeen123") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "home.html";
    } else {
        document.getElementById("error").innerText = "Invalid Login!";
    }
}
