const urlString = window.location.href
const url = new URL(urlString);
console.log(url.searchParams);
const id = url.searchParams.get("productid");

if (id === null || id === undefined) {
  window.location.href = "/pages/products/index.html";
}

function getOneProduct(productId) {
  const product = callAPI("GET", `products/${productId}`, {})
    .then((res) => {
      const product = res.data.product;
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

  return product;
}

function generateProductHTML(product) {
  return `
    <h1>${product.name}</h1>
    <div class="productContent d-flex flex-column flex-md-row mt-4">
      <div class="productImage">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="productInfo w-100 ms-md-4 mt-4">
        <p class="productBrand mb-0 rounded pt-1 pb-1 ps-2 pe-2 mb-2">${product.brand}</p>
        <p class="productOwner mb-2 mb-md-0 text-truncate">${product.owner}</p>
        <p class="productPrice mb-2 mb-md-0 p-2 rounded">${product.price}</p>
      </div>
    </div>
  `;
}

function addProductToPage(product) {
  const productHTML = generateProductHTML(product);
  const productContainer = document.getElementsByClassName("product")[0];
  productContainer.innerHTML += productHTML;
}

async function displayProduct(id) {
  const product = await getOneProduct(id)
  addProductToPage(product)
}

displayProduct(id);



