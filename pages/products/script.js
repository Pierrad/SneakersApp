let NUMBER_OF_PRODUCTS = 5

//
// MAP
//
const MAP = L.map('map').setView([48, 2], 5);
const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom : 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(MAP);

// ! Attention, user est définie depuis le fichier js/userService.js
document.getElementById("title").innerHTML = `Bienvenue ${user.username}`;

//
// HTML Generation
//
function generateProductHTML(product) {
  return `
    <div class="product w-100 d-flex flex-column flex-md-row mb-4 pb-2 position-relative">
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
      ${product.x && product.y ? ``: `
        <div id="warningBox" class="position-absolute bottom-0 end-0 mb-2 me-1" data-product="${product.id}" onclick="openGeolocalizationModal(this)">
          <img src="../../assets/images/warning.svg" alt="warningIcone" height="50px" width="50px" />
        </div>
      `}
    </div>
  `;
}

function addProductToPage(product) {
  const productHTML = generateProductHTML(product);
  const productContainer = document.getElementsByClassName("productsList")[0];
  productContainer.innerHTML += productHTML;
  generateMarker(product)
}

function generateMarker(product) {
  if (product.x && product.y) {
    const marker = L.marker([product.x, product.y]).addTo(MAP);
    marker.bindPopup(`<img src="${product.image}" width="200px" height="200px" />`, {
      minWidth: 200,
      minHeight: 200,
    });
  }
}

function showNumberOfProducts(number) {
  const numberOfProducts = document.getElementsByClassName("numberOfProducts")[0];
  numberOfProducts.innerHTML = `${number} produits`;
}

//
// API
//
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
          x: content.x,
          y: content.y,
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
        x: content.x,
        y: content.y,
      };
    });

  return product;
}

function modifyProduct(prod) {
  callAPI("POST", `products/${prod.id}`, {
    content: {
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      ...(prod.x && prod.y ? { x: prod.x, y: prod.y } : {})
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


//
// MODALS
//
const modal = document.getElementById("myModal");
const geoLocalizationModal = document.getElementById("geoLocalizationModal");

async function openModal(e) {
  modal.classList.add("show");

  const productId = e.dataset.product;
  const product = await getOneProduct(productId);

  const nameInput = document.getElementById("modalNameInput");
  const brandInput = document.getElementById("modalBrandInput");
  const priceInput = document.getElementById("modalPriceInput");
  const submit = document.getElementById("modalSubmit");
  const externalLink = document.getElementById("modalExternalLink");
  const modalClose = document.getElementById("modalClose");

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
      id: productId,
      name: nameInput.value,
      brand: brandInput.value,
      price: priceInput.value,
    });
  });
  externalLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/pages/product/index.html?productid=${productId}`;
  });
  modalClose.onclick = function () {
    modal.classList.remove("show");
  };
}

const showError = (error) => {
  const message = document.getElementById("toast-text");
  message.innerHTML = error;

  const toaster = document.getElementById('toaster');
  toaster.classList.add("bg-danger");
  const toast = new bootstrap.Toast(toaster);
  toast.show();
}

async function openGeolocalizationModal(e) {
  const productId = e.dataset.product;
  const product = await getOneProduct(productId);
  geoLocalizationModal.classList.add("show");

  const ctaMyLocalization = document.getElementById("geoMyLocalization");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const submitLocalization = document.getElementById("submitLocalization");
  const geoModalClose = document.getElementById("geoModalClose");

  // Custom event
  const inputEvent = new CustomEvent("isSubmitable");

  // By default
  submitLocalization.disabled = true;

  // Event listeners
  latitudeInput.addEventListener("input", function (event) {
    document.dispatchEvent(inputEvent);
    handleCoordInput(event);
  });
  longitudeInput.addEventListener('input', function(event) {
    document.dispatchEvent(inputEvent);
    handleCoordInput(event);
  });

  const handleCoordInput = (event) => {
    const element = event.target;
    element.classList.remove('is-invalid');
    if (/^\d+\.?\d*$/.test(element.value) === false) {
      submitLocalization.disabled = true;
      element.value = "";
      element.classList.add('is-invalid');
    }
  };
  
  document.addEventListener('isSubmitable', function () {
    if (latitudeInput.value !== "" && longitudeInput.value !== "") {
      submitLocalization.disabled = false;
    } else {
      submitLocalization.disabled = true;
    }
  });

  ctaMyLocalization.addEventListener('click', (e) => {
    navigator.geolocation.getCurrentPosition(handleLocalizationUpdate, () => showError("Veuillez activer la localisation du navigateur."));
  });

  submitLocalization.addEventListener("click", (e) => {
    handleLocalizationUpdate({ coords : { latitude: latitudeInput.value, longitude: longitudeInput.value } });
  });

  const handleLocalizationUpdate = (position) => {
    modifyProduct({ ...product, x: position.coords.latitude, y: position.coords.longitude });
    geoLocalizationModal.classList.remove("show");
  }

  geoModalClose.onclick = function () {
    geoLocalizationModal.classList.remove("show");
  };
}


window.onclick = function (event) {
  if (event.target == modal || event.target == geoLocalizationModal) {
    modal.classList.remove("show");
    geoLocalizationModal.classList.remove("show");
  }
};


//
// LOAD MORE
//
const loadmore = document.getElementById('loadMore');

loadmore.addEventListener('click', (e) => {
  const productsList = JSON.parse(localStorage.getItem('products'))
  if(productsList !== undefined) {
    for(let i = NUMBER_OF_PRODUCTS; i < NUMBER_OF_PRODUCTS+4; i++){
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
});


//
// Start
//
getProducts();
