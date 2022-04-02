if (localStorage.getItem("token") === null || document.cookie.indexOf("authToken") === -1) {
  window.location.href = "/pages/login/index.html";
} else {
  window.location.href = "/pages/products/index.html";
}
