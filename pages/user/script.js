const name = document.getElementById("name");
const email = document.getElementById("email");
const publicIdElement = document.getElementById("publicID");
const roleElement = document.getElementById("role");

name.innerHTML = user.username;
email.innerHTML = user.email;
publicIdElement.innerHTML = user.publicId;
roleElement.innerHTML = user.role;

