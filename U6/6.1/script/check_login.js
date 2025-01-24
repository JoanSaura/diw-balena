$(document).ready(() => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginName = document.getElementById("username");
  const userCont = document.getElementById("user-cont");

  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu";
  const menuList = document.createElement("ul");

  if (currentUser) {
    loginName.innerText = currentUser.name;
    loginName.style.cursor = "pointer";
    userCont.style.display = "none";
    loginName.style.display = "block";

    if (currentUser.is_admin === true) {
      const adminPageOption = document.createElement("li");
      const adminLink = document.createElement("a");
      adminLink.href = "../html/admin_page.html";
      adminLink.innerText = "Admin Page"; 
      adminPageOption.appendChild(adminLink);
      menuList.appendChild(adminPageOption);
    }

    // Crear la opción de "Logout"
    const logoutOption = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.innerText = "Logout";
    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();  // Recarga la página
    });
    logoutOption.appendChild(logoutLink);
    menuList.appendChild(logoutOption);

    dropdownMenu.appendChild(menuList);
    loginName.parentElement.appendChild(dropdownMenu);

    // Lógica para mostrar/ocultar el menú desplegable
    loginName.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.style.display =
        dropdownMenu.style.display === "none" ? "block" : "none";
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
    });
  } else {
    loginName.style.display = "none";
    userCont.style.display = "flex";
  }
});
