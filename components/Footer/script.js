const Footer = document.getElementsByClassName("Footer")[0];

function generateFooter() {
  return `
    <div class="footerContainer">
      <div class="footerWrapper">
      <img src="../../assets/images/nike-white.svg" alt="logo" class="footerLogo">
      <div class="footerLinks">
        <a href="https://www.facebook.com" class="footerLink">
          <img src="../../assets/images/facebook.svg" alt="facebook icon" class="footerIcon">
        </a>
        <a href="https://www.instagram.com" class="footerLink">
        <img src="../../assets/images/instagram.svg" alt="instagram icon" class="footerIcon">
      </a>
      <a href="https://www.twitter.com" class="footerLink">
        <img src="../../assets/images/twitter.svg" alt="twitter icon" class="footerIcon">
      </a>
      </div>
    </div>
  `

}

Footer.innerHTML = generateFooter();
