const scrollBar = document.getElementsByClassName("scrollBar")[0];

window.addEventListener('scroll', function(e) {
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight;
  const clientHeight = document.body.clientHeight;
  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollBar.style.top = `${scrollPercent}%`;
});


function generateProductHTML(product) {
  return `
    <div class="product">
      <div class="productImage" onclick="openModal(this)">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="productDetails">
        <h3>${product.name}</h3>
        <div class="productMeta">
          <p class="productPrice">${product.price}</p>
          <button class="productCta">Buy</button>
        </div>
      </div>
    </div>
  `;
}

function addProductToPage(product) {
  const productHTML = generateProductHTML(product);
  const productContainer = document.getElementsByClassName("someProducts")[0];
  productContainer.innerHTML += productHTML;
}


function getProducts() {
  productsList = callAPI("GET", "products", {})
    .then((res) => {
      const products = res.data.products;
      const newProducts = products.map((product) => {
        const content = JSON.parse(product.content);
        return {
          name: content.name,
          image: product.image,
          price: content.price,
        };
      });

      newProducts.forEach((newP, item) => {
        if(item < 3){
          addProductToPage(newP)
        }
      });
    });
}


getProducts();