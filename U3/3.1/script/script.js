document.addEventListener("DOMContentLoaded", function() {
    const closeBtn = document.querySelector("#lateral .close");
    const lateralMenu = document.getElementById("lateral");
    const assemblyPictures = document.querySelectorAll(".assembly-pictures");

    let isMenuOpen = true;
  
    closeBtn.addEventListener("click", function() {
      if (isMenuOpen) {
        lateralMenu.style.left = "-170px";
        closeBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else {
        lateralMenu.style.left = "0";
        closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
      }
      isMenuOpen = !isMenuOpen;
    });
});




