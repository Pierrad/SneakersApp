const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// On vérifie si on a une erreur en paramètre de la page.
const urlString = window.location.href;
const url = new URL(urlString);
const hasError = url.searchParams.get("showError");

// Events
let inputEvent = new CustomEvent("isSubmitable");

const mailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
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

function resetToasterStyle() {
  const toaster = document.getElementById('toaster');
  toaster.classList.remove("bg-success");
  toaster.classList.remove("bg-danger");
}

function showSuccess(success) {
  submit.disabled = true;
  mailInput.classList.remove("false");
  passwordInput.classList.remove("false");

  const message = document.getElementById("toast-text");
  message.innerHTML = success;

  resetToasterStyle();
  const toaster = document.getElementById('toaster');
  toaster.classList.add("bg-success");
  const toast = new bootstrap.Toast(toaster);
  toast.show();
}

function showError(error) {
  mailInput.classList.add("false");
  passwordInput.classList.add("false");

  const message = document.getElementById("toast-text");
  message.innerHTML = error;

  resetToasterStyle();
  const toaster = document.getElementById('toaster')
  toaster.classList.add("bg-danger");
  const toast = new bootstrap.Toast(toaster);
  toast.show();
}

function showPending() {
  submitLabel.classList.add("hidden");
  spinner.classList.remove("hidden");
}

function hidePending() {
  submitLabel.classList.remove("hidden");
  spinner.classList.add("hidden");
}


function authentificate(event) {
  event.preventDefault();

  showPending();

  const form = document.getElementById("form");
  const formData = new FormData(form);

  const onLogin = window.location.href.includes("login")

  callAPI("POST", onLogin ? "users/login" : "users/register", formData)
    .then((res) => {
      hidePending();      
      if (res.success) {
        showSuccess(onLogin ? "Login success!" : "Register success!");
        const token = res.data.user.token.token;
        const expiration = res.data.user.token.expiration;
        localStorage.setItem("user", JSON.stringify(res.data.user));
        document.cookie = `authToken=${token};max-age=${expiration};path=/`;
        window.location.href = "/pages/products/index.html";
      } else {
        showError(onLogin ? "Login Failed!" : "Register Failed!");
      }
    })
    .catch(function (error) {
      showError("Error");
    });
}
