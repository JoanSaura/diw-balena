import { getUserByEmail, changePassword } from "./firebase.js";

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

    // Menú de administrador
    if (currentUser.is_admin === true) {
      const adminPageOption = document.createElement("li");
      const adminLink = document.createElement("a");
      adminLink.href = "../html/admin_page.html";
      adminLink.innerText = "Página de administrador"; 
      adminPageOption.appendChild(adminLink);
      menuList.appendChild(adminPageOption);
    }

    // Crear la opción de "Cerrar sesión"
    const logoutOption = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.innerText = "Cerrar sesión";
    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();  // Recarga la página
    });
    logoutOption.appendChild(logoutLink);
    menuList.appendChild(logoutOption);

    dropdownMenu.appendChild(menuList);
    loginName.parentElement.appendChild(dropdownMenu);

    // Mostrar/ocultar el menú desplegable
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

  // Lógica de cambio de contraseña
  const changePasswordForm = $("#change-password-form");
  
  if (currentUser && currentUser.is_first_login) {
    changePasswordForm.on("submit", async (e) => {
      e.preventDefault();

      const newPassword = $("#new-password").val().trim();
      if (!newPassword) {
        alert("Por favor ingresa una nueva contraseña.");
        return;
      }

      const newSalt = generateSalt();  // Genera un nuevo salt
      await changePassword(currentUser.email, newPassword, newSalt);

      // Actualiza el estado en el localStorage
      currentUser.is_first_login = false;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Redirige a la página de administración
      window.location.href = "../html/admin_page.html"; 
    });
  }
});
