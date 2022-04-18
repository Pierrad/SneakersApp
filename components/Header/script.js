const Header = document.getElementsByClassName("Header")[0];
let isMobile = false;

showHeader();

window.addEventListener(
  "resize",
  function () {
    showHeader();
  },
  true
);

function showHeader() {
  if (window.innerWidth > 640) {
    Header.innerHTML = generateDesktopHeader();
  } else {
    Header.innerHTML = generateMobileHeader();
    isMobile = true;
  }
}


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
        <img src="../../assets/images/user.svg" alt="avatar" class="logo" onclick="redirectToUserPage()">
      </div>
    </div>
  `;
}

function generateMobileHeader() {
  return `
    <div class="headerMobileLinks">
      <img src="../../assets/images/return.svg" alt="return icon" class="returnIcon" id="returnIcon">
      <div class="headerMobileLinkBox">
        <a id="home" href="/pages/landing/index.html" class="headerMobileLink">
          <img src="../../assets/images/home.svg" alt="home icon" class="mobileLogoLink">
          <p>Accueil</p>
        </a>
        <a id="product" href="/pages/products/index.html" class="headerMobileLink">
          <img src="../../assets/images/sneakers.png" alt="home icon" class="mobileLogoLink2">
          <p>Produits</p>
        </a>
      </div>
    </div>
    <div class="headerMobileContainer">
      <img src="../../assets/images/burger.svg" alt="burger icon" class="burgerIcon" id="burgerIcon">
      <img src="../../assets/images/logo.svg" alt="logo" class="logoMobile" onclick="redirectToLanding()">
      <div class="headerMobileUser">
        <img src="../../assets/images/shopping_cart.svg" alt="shopping cart" class="mobileIcon">
        <img src="../../assets/images/user.svg" alt="avatar" class="mobileIcon" onclick="redirectToLogin()">
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

function redirectToUserPage() {
  window.location.href = "/pages/user/index.html";
}

if (isMobile) {
  const burgerIcon = document.getElementById("burgerIcon");
  const returnIcon = document.getElementById("returnIcon");

  burgerIcon.addEventListener("click", handleMobileMenuOpen);
  returnIcon.addEventListener("click", handleMobileMenuClose);
  burgerIcon.addEventListener("touchstart", handleMobileMenuOpen);
  returnIcon.addEventListener("touchstart", handleMobileMenuClose);

  function handleMobileMenuOpen(e) {
    e.preventDefault();
    const mobileLinks = document.getElementsByClassName("headerMobileLinks")[0];
    mobileLinks.classList.add("show");
  }

  function handleMobileMenuClose(e) {
    e.preventDefault();
    const mobileLinks = document.getElementsByClassName("headerMobileLinks")[0];
    mobileLinks.classList.remove("show");
  }
}

const homeLink = document.getElementById("home");
const productLink = document.getElementById("product");

if (window.location.href.match("/pages/landing/index.html")) {
  homeLink.classList.add("active");
  productLink.classList.remove("active");
} else if (window.location.href.match("/pages/products/index.html" || "/pages/product/index.html")) {
  homeLink.classList.remove("active");
  productLink.classList.add("active");
} else {
  homeLink.classList.remove("active");
  productLink.classList.remove("active");
}
