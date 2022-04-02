const scrollBar = document.getElementsByClassName("scrollBar")[0];


window.addEventListener('scroll', function(e) {
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight;
  const clientHeight = document.body.clientHeight;
  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollBar.style.top = `${scrollPercent}%`;
});