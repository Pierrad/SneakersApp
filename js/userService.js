window.getCookie = function(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

if ((localStorage.getItem("token") === null || document.cookie.indexOf("authToken") === -1 || getCookie("authToken") === undefined)  && window.location.href !== "/pages/login/index.html") {
  window.location.href = "/pages/login/index.html";
}

const user = JSON.parse(localStorage.getItem("user"));

if (user === null) {
  window.location.href = "/pages/login/index.html";
}

if (window.location.href.includes('/index.html') && !window.location.href.includes('/pages')) {
  window.location.href = "/pages/landing/index.html";
}