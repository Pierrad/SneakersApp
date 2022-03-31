if (localStorage.getItem("token") === null || document.cookie.indexOf("authToken") === -1) {
  window.location.href = "../../index.html";
}

if (localStorage.getItem("username") !== null) {
  document.getElementById("title").innerHTML = `Bienvenue ${localStorage.getItem("username")}`;
}


function generateProductHTML(product) {
  return `
    <div class="product">
      <div class="productImage" onclick="() => openModal(product)">
        <img src="${product.image}" alt="${product.content}">
      </div>
      <div class="productDetails">
        <h2>${product.name}</h2>
        <div class="productMeta">
          <p class="productId">${String(product.id)}</p>
          <p class="productOwner">${product.owner}</p>
          <p class="productPrice">${product.price}</p>
        </div>
        <p class="productBrand">${product.brand}</p>
      </div>
    </div>
  `;
}

function addProductToPage(product) {
  const productHTML = generateProductHTML(product);
  const productContainer = document.getElementsByClassName("productsList")[0];
  productContainer.innerHTML += productHTML;
}

function showNumberOfProducts(number) {
  const numberOfProducts = document.getElementsByClassName("numberOfProducts")[0];
  numberOfProducts.innerHTML = `${number} produits`;
}

function getProducts() {
  const headers = new Headers();
  headers.append("owner", "F3QwUaEQKnTDVEHWr2sugb5AAfkoj0eh1qV9kua2");
  headers.append("Authorization", localStorage.getItem("token"));

  const config = {
    method: "GET",
    headers,
    mode: "cors",
    cache: "default",
  };

  fetch("https://m413.joss-coupet.eu/products", config)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      const products = res.data.products;
      console.log(products)
      showNumberOfProducts(products.length);
      const newProducts = products.map((product, item) => {
        const content = JSON.parse(product.content);
        return {
          id: product._id,
          name: content.name,
          brand: content.brand,
          image: product.image,
          owner: product.owner,
          price: content.price,
        };
      });

      newProducts.forEach(addProductToPage);
    });
}

getProducts();


let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close")[0];

function openModal(product) {
  console.log(product)
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}




