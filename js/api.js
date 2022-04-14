const callAPI = async (method, url, data) => {
  const headers = new Headers();
  if (!(data instanceof FormData)) {
    headers.append("Content-type", "application/json");
  }
  headers.append("owner", "F3QwUaEQKnTDVEHWr2sugb5AAfkoj0eh1qV9kua2");
  headers.append("Authorization", JSON.parse(localStorage.getItem("user")).token.token);

  const conf = {
    method,
    headers,
  };


  const fullConfig = {
    ...conf,
    ...(data instanceof FormData
      ? { body: data }
      : Object.keys(data).length !== 0 && { body: JSON.stringify(data) }),
  }

  const response = await fetch(`https://m413.joss-coupet.eu/${url}`, fullConfig);
  if ((response.status === 500 || response.status === 403 || response.status === 404) && window.location.href !== "/pages/login/index.html") {
    window.location.href = "/pages/login/index.html?showError=1";
  }
  const res = await response.json();
  return res;
}