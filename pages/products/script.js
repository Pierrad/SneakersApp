let NUMBER_OF_PRODUCTS = 5

/* map of the store */

const MAP = L.map('map').setView([51.505, -0.09], 13);
const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {maxZoom : 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })
			.addTo(MAP);

// ! Attention, user est définie depuis le fichier js/userService.js
document.getElementById("title").innerHTML = `Bienvenue ${user.username}`;

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
        <div id="warningBox" class="position-absolute bottom-0 end-0" data-product="${product.id}" onclick="openGeolocalizationModal(this)">
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
}

function generateMarker(product) {
  if (product.x && product.y) {
    // MAP.refresh();
    const marker = L.marker([product.x, product.y]).addTo(MAP);
    marker.bindPopup(`<img src="${product.image}" width="300px" height="200px" />`);
  }
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
          x: content.x,
          y: content.y,
        };
      });

      newProducts.forEach((newP, item) => {
        if(item< NUMBER_OF_PRODUCTS){
          addProductToPage(newP)
          generateMarker(newP)
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
    for(let i = NUMBER_OF_PRODUCTS; i < NUMBER_OF_PRODUCTS+4; i++){
      addProductToPage(productsList[i])
      generateMarker(productsList[i])
    }
    NUMBER_OF_PRODUCTS += 4
    if(NUMBER_OF_PRODUCTS + 4 >= productsList.length) {
      for(let j = NUMBER_OF_PRODUCTS; j < productsList.length; j++){
        addProductToPage(productsList[j])
        generateMarker(productsList[j])
      }
      NUMBER_OF_PRODUCTS = NUMBER_OF_PRODUCTS+(productsList.length-NUMBER_OF_PRODUCTS)
      e.target.style.display = 'none';
    }
}

})

function modifyProductWithLocalization(prod) {
  callAPI("POST", `products/${prod.id}`, {
    content: {
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      x: prod.x,
      y: prod.y,
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


async function openGeolocalizationModal(e) {
  const productId = e.dataset.product;
  const product = await getOneProduct(productId);


  const geoLocalizationModal = document.getElementById("geoLocalizationModal");
  const geoLocalizationModalClose = document.getElementById("geoLocalizationModalClose");
  const geoMyLocalization = document.getElementById("geoMyLocalization");

  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const submitLocalization = document.getElementById("submitLocalization");
  let inputEvent = new CustomEvent("isSubmitable");

  submitLocalization.disabled = true;
  geoLocalizationModal.classList.add("show");

  geoLocalizationModalClose.onclick = function () {
    geoLocalizationModal.classList.remove("show");
  };


  latitudeInput.addEventListener("input", function (event) {
    document.dispatchEvent(inputEvent);
    latitudeInput.classList.remove('is-invalid');
    console.log("jeee")
    if (/^\d+\.?\d*$/.test(event.target.value) === false) {
      submitLocalization.disabled = true;
      latitudeInput.value = "";
      latitudeInput.classList.add('is-invalid');
    }
  });
  
  longitudeInput.addEventListener('input', function(event) {
    document.dispatchEvent(inputEvent);
    longitudeInput.classList.remove('is-invalid');
    if (/^\d+\.?\d*$/.test(event.target.value) === false) {
      submitLocalization.disabled = true;
      longitudeInput.value = "";
      longitudeInput.classList.add('is-invalid');
    }
  })
  
  document.addEventListener('isSubmitable', function () {
    if (latitudeInput.value !== "" && longitudeInput.value !== "") {
      submitLocalization.disabled = false;
    } else {
      submitLocalization.disabled = true;
    }
  });

  geoMyLocalization.addEventListener('click', (e) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      modifyProductWithLocalization({ ...product, x: position.coords.latitude, y: position.coords.longitude });
      geoLocalizationModal.classList.remove("show");
    }, function (error) {
      alert("Veuillez accepter la géolocalisation"); 
    });
  });

  submitLocalization.addEventListener("click", (e) => {
    modifyProductWithLocalization({ ...product, x: latitudeInput.value, y: longitudeInput.value });
    geoLocalizationModal.classList.remove("show");
  });
}