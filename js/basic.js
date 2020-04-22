var canv;
function ready() {
  canv = document.getElementById("myCanvas");
  // Update the path from the JavaScript code.
  window.onload = function () {
    canv.style.width = this.screen.width;
    canv.style.height = screen.height;
  };

  window.onresize = function () {
    canv.style.width = this.screen.width;
    canv.style.height = screen.height;
  };
}
