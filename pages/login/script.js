const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// On vérifie si on a une erreur en paramètre de la page.
const urlString = window.location.href
const url = new URL(urlString);
const hasError = url.searchParams.get("showError");

// Events
let inputEvent = new CustomEvent("isSubmitable");

const mailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const successBox = document.getElementById("success");
const errorBox = document.getElementById("error");
const spinner = document.getElementById("spinner");
const submit = document.getElementById("submit");
const submitLabel = document.getElementById("buttonText");

// Par défaut
submit.disabled = true;
if (hasError === '1') {
  showError("Error");
}


mailInput.addEventListener("input", function () {
  document.dispatchEvent(inputEvent);
  if (validateEmail(this.value)) {
    this.classList.add("true");
    this.classList.remove("false");
  } else {
    this.classList.add("false");
    this.classList.remove("true");
  }
});

passwordInput.addEventListener('input', function() {
  document.dispatchEvent(inputEvent);
})

document.addEventListener('isSubmitable', function () {
  if (validateEmail(mailInput.value) && passwordInput.value !== '') {
    submit.disabled = false;
  } else {
    submit.disabled = true;
  }
});

function showSuccess() {
  submit.disabled = true;
  mailInput.classList.remove("false");
  passwordInput.classList.remove("false");

  successBox.classList.add("show");
  errorBox.classList.remove("show");
  setTimeout(() => {
    successBox.classList.remove("show");
  }, 5000);
}

function showError(error) {
  const message = document.getElementById("messageBoxError");
  message.innerHTML = error;
  mailInput.classList.add("false");
  passwordInput.classList.add("false");

  errorBox.classList.add("show");
  successBox.classList.remove("show");
  setTimeout(() => {
    errorBox.classList.remove("show");
  }, 5000);
}

function showPending() {
  submitLabel.classList.add("hidden");
  spinner.classList.remove("hidden");
}

function hidePending() {
  submitLabel.classList.remove("hidden");
  spinner.classList.add("hidden");
}


function login(event) {
  event.preventDefault();

  showPending();

  const form = document.getElementById("loginForm");
  const formData = new FormData(form);

  callAPI("POST", "users/login", formData)
    .then((res) => {
      hidePending();      
      if (res.success) {
        showSuccess();
        const token = res.data.user.token.token;
        const expiration = res.data.user.token.expiration;
        localStorage.setItem("user", JSON.stringify(res.data.user));
        document.cookie = `authToken=${token};max-age=${expiration};path=/`;
        window.location.href = "/pages/products/index.html";
      } else {
        showError("Login Failed!");
      }
    })
    .catch(function (error) {
      showError("Error");
    });
}
