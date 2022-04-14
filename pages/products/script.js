let NUMBER_OF_PRODUCTS = 6

// ! Attention, user est définie depuis le fichier js/userService.js
document.getElementById("title").innerHTML = `Bienvenue ${user.username}`;

function generateProductHTML(product) {
  return `
    <div class="product">
      <div class="productImage" data-product="${product.id}" onclick="openModal(this)">
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
        // window.location.reload();
      } else {
        console.warn("Error while updating product");
      }
    });
}

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

async function openModal(e) {
  modal.style.display = "block";
  const productId = e.dataset.product;
  const product = await getOneProduct(productId);

  const nameInput = document.getElementById("modalNameInput");
  const brandInput = document.getElementById("modalBrandInput");
  const priceInput = document.getElementById("modalPriceInput");
  const submit = document.getElementById("modalSubmit");
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
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
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
