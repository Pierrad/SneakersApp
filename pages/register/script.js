const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
  const mailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const usernameInput = document.getElementById("username");
  const successBox = document.getElementById("success");
  const errorBox = document.getElementById("error");
  const spinner = document.getElementById("spinner");
  const submit = document.getElementById("submit");
  const submitLabel = document.getElementById("buttonText");
  
  mailInput.addEventListener("input", function () {
    if (validateEmail(this.value)) {
      this.classList.add("true");
      this.classList.remove("false");
    } else {
      this.classList.add("false");
      this.classList.remove("true");
    }
  });
  
  function showSuccess() {
    submit.disabled = true;
    mailInput.classList.remove("false");
    passwordInput.classList.remove("false");
    usernameInput.classList.remove("false");
  
    successBox.classList.add("show");
    errorBox.classList.remove("show");
    setTimeout(() => {
      successBox.classList.remove("show");
    }, 5000);
  }
  
  function showError() {
    mailInput.classList.add("false");
    passwordInput.classList.add("false");
    usernameInput.classList.add("false");
  
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
  
  
  function register(event) {
    event.preventDefault();
  
    showPending();
  
    const headers = new Headers();
    headers.append("owner", "F3QwUaEQKnTDVEHWr2sugb5AAfkoj0eh1qV9kua2");
  
    const form = document.getElementById("registerForm");
    const formData = new FormData(form);
  
    const config = {
      method: "POST",
      headers,
      mode: "cors",
      cache: "default",
      body: formData,
    };
  
    fetch("https://m413.joss-coupet.eu/users/register", config)
      .then(function (response) {
        return response.json();
      })
      .then((res) => {
        hidePending();      
        if (res.success) {
          showSuccess();
          const username = res.data.user.username;
          const token = res.data.user.token.token;
          const expiration = res.data.user.token.expiration;
          localStorage.setItem("username", username);
          localStorage.setItem("token", String(token));
          document.cookie = `authToken=${res.data.user.token.token};max-age=${expiration};path=/`;
          window.location.href = "./pages/products/products.html";
        } else {
          showError();
        }
      })
      .catch(function (error) {
        showError();
      });
  }
  