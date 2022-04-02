const Header = document.getElementsByClassName("Header")[0];

Header.innerHTML += generateDesktopHeader();

function generateDesktopHeader() {
  return `
    <div class="headerContainer">
      <img src="../../assets/images/logo.svg" alt="logo" class="logo" onclick="redirectToLanding()">
      <div class="headerLinks">
        <a id="home" href="/pages/landing/index.html" class="headerLink">Accueil</a>
        <a id="product" href="/pages/products/index.html" class="headerLink">Produits</a>
      </div>
      <div class="headerUser">
        <img src="../../assets/images/shopping_cart.svg" alt="shopping cart" class="logo">
        <img src="../../assets/images/user.svg" alt="avatar" class="logo" onclick="redirectToLogin()">
      </div>
    </div>
  `;
}

function redirectToLogin() {
  window.location.href = "/pages/login/index.html";
}

function redirectToLanding() {
  window.location.href = "/pages/landing/index.html";
}

const homeLink = document.getElementById("home");
const productLink = document.getElementById("product");

if (window.location.href.match("/pages/landing/index.html")) {
  homeLink.classList.add("active");
  productLink.classList.remove("active");
} else {
  homeLink.classList.remove("active");
  productLink.classList.add("active");
}
