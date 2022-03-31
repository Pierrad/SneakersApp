if (localStorage.getItem("token") === null || document.cookie.indexOf("authToken") === -1) {
  window.location.href = "../../index.html";
}

if (localStorage.getItem("username") !== null) {
  document.getElementById("title").innerHTML = `Bienvenue ${localStorage.getItem("username")}`;
}

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

      newProducts.forEach(addProductToPage);
    });
}

function getOneProduct(productId) {
  const headers = new Headers();
  headers.append("owner", "F3QwUaEQKnTDVEHWr2sugb5AAfkoj0eh1qV9kua2");
  headers.append("Authorization", localStorage.getItem("token"));

  const config = {
    method: "GET",
    headers,
    mode: "cors",
    cache: "default",
  };

  const product = fetch(`https://m413.joss-coupet.eu/products/${productId}`, config)
    .then((response) => {
      return response.json();
    })
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

/**
 * Pour une raison inconnue, la modification du produit ne fonctionne pas. 
 * La charge utile de la requête contient bien le bon body avec les informations à modifier et on reçoit bien une réponse 200.
 * Mais les données sont toujours les mêmes après le rechargement de la page.
 * Sur postman, la modification fonctionne bien.
 */
function modifyProduct(prod) {
  const headers = new Headers();
  headers.append("owner", "F3QwUaEQKnTDVEHWr2sugb5AAfkoj0eh1qV9kua2");
  headers.append("Authorization", localStorage.getItem("token"));

  const body = JSON.stringify({
    content: {
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
    },
  });

  const conf = {
    method: "POST",
    headers,
    mode: "cors",
    body,
  };

  fetch(`https://m413.joss-coupet.eu/products/${prod.productId}`, conf)
    .then((response) => {
      return response.json();
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
