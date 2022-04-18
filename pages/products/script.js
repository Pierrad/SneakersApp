let NUMBER_OF_PRODUCTS = 6

// ! Attention, user est définie depuis le fichier js/userService.js
document.getElementById("title").innerHTML = `Bienvenue ${user.username}`;

function generateProductHTML(product) {
  return `
    <div class="product w-100 d-flex flex-column flex-md-row mb-4 pb-2">
      <div class="productImage me-3" role="button" data-product="${product.id}" onclick="openModal(this)">
        <img class="rounded h-auto" width="150px" src="${product.image}" alt="${product.content}">
      </div>
      <div class="productDetails w-100 d-flex flex-column justify-content-between mt-3 pb-3">
        <h2 class="mb-3">${product.name}</h2>
        <div class="productMeta d-flex flex-column flex-md-row align-content-start align-items-md-center justify-content-between mb-2">
          <p class="productId mb-2 mb-md-0">${String(product.id)}</p>
          <p class="productOwner mb-2 mb-md-0">${product.owner}</p>
          <p class="productPrice mb-2 mb-md-0 p-2 rounded">${product.price}</p>
        </div>
        <p class="productBrand mb-0 rounded pt-1 pb-1 ps-2 pe-2 mb-2">${product.brand}</p>
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
  callAPI("GET", 'products', {})
    .then((res) => {
      const products = res.data.products;
      showNumberOfProducts(products.length);
      const newProducts = products.map((product) => {
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

      newProducts.forEach((newP, item) => {
        if(item< NUMBER_OF_PRODUCTS){
          addProductToPage(newP)
        }
      });
      localStorage.setItem('products', JSON.stringify(newProducts))
    })
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

function modifyProduct(prod) {
  callAPI("POST", `products/${prod.productId}`, {
    content: {
      name: prod.name,
      brand: prod.brand,
      price: prod.price
    }
  })
    .then((res) => {
      if (res.success === true) {
        window.location.reload();
      } else {
        console.warn("Error while updating product");
      }
    });
}

const modal = document.getElementById("myModal");
const close = document.getElementById("modalClose");

async function openModal(e) {
  modal.classList.add("show");

  const productId = e.dataset.product;
  const product = await getOneProduct(productId);

  const nameInput = document.getElementById("modalNameInput");
  const brandInput = document.getElementById("modalBrandInput");
  const priceInput = document.getElementById("modalPriceInput");
  const submit = document.getElementById("modalSubmit");
  const externalLink = document.getElementById("modalExternalLink");
  nameInput.value = product.name;
  brandInput.value = product.brand;
  priceInput.value = product.price;

  nameInput.addEventListener("input", () => {
    submit.classList.remove("hide");
  });
  brandInput.addEventListener("input", () => {
    submit.classList.remove("hide");
  });
  priceInput.addEventListener("input", () => {
    submit.classList.remove("hide");
  });
  submit.addEventListener("click", (e) => {
    e.preventDefault();
    modifyProduct({
      productId,
      name: nameInput.value,
      brand: brandInput.value,
      price: priceInput.value,
    });
  });
  externalLink.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(productId);
    window.location.href = `/pages/product/index.html?productid=${productId}`;
  });
}

close.onclick = function () {
  modal.classList.remove("show");
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};

getProducts();

const loadmore = document.querySelector('.loadMore');

loadmore.addEventListener('click', (e) => {
  const productsList = JSON.parse(localStorage.getItem('products'))
  if(productsList !== undefined){
    for(let i = NUMBER_OF_PRODUCTS; i<NUMBER_OF_PRODUCTS+4; i++){
      addProductToPage(productsList[i])
    }
    NUMBER_OF_PRODUCTS += 4
    if(NUMBER_OF_PRODUCTS + 4 >= productsList.length) {
      for(let j = NUMBER_OF_PRODUCTS; j < productsList.length; j++){
        addProductToPage(productsList[j])
        
      }
      NUMBER_OF_PRODUCTS = NUMBER_OF_PRODUCTS+(productsList.length-NUMBER_OF_PRODUCTS)
      e.target.style.display = 'none';
    }
}

})
