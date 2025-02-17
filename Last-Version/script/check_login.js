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

    if (currentUser.is_admin === true) {
      const adminPageOption = document.createElement("li");
      const adminLink = document.createElement("a");
      adminLink.href = "../html/admin_page.html";
      adminLink.innerText = "Página de l'administrador"; 
      adminPageOption.appendChild(adminLink);
      menuList.appendChild(adminPageOption);
    }

    
    const logoutOption = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.innerText = "Tanca sesisó";
    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();  
    });
    logoutOption.appendChild(logoutLink);
    menuList.appendChild(logoutOption);

    dropdownMenu.appendChild(menuList);
    loginName.parentElement.appendChild(dropdownMenu);

    loginName.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.style.display =
        dropdownMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
    });
  } else {
    loginName.style.display = "none";
    userCont.style.display = "flex";
  }

  const changePasswordForm = $("#change-password-form");
  
  if (currentUser && currentUser.is_first_login) {
    changePasswordForm.on("submit", async (e) => {
      e.preventDefault();

      const newPassword = $("#new-password").val().trim();
      if (!newPassword) {
        alert("Por favor ingresa una nueva contraseña.");
        return;
      }

      const newSalt = generateSalt();  
      await changePassword(currentUser.email, newPassword, newSalt);

      currentUser.is_first_login = false;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      window.location.href = "../html/admin_page.html"; 
    });
  }
});
