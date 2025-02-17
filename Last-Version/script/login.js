import { getUserByEmail } from "./firebase.js";

$(document).ready(() => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    window.location.href = user.is_first_login 
      ? "../html/change_password.html" 
      : "../html/admin_page.html";
    return;
  }

  $("#login").on("submit", async (e) => {
    e.preventDefault();

    const email = $("#login input[type='text']").val().trim();
    const password = $("#login input[type='password']").val().trim();
    const loginMessage = $("#login-message");
    loginMessage.hide();

    if (!email || !password) {
      loginMessage.text("Introduce correo y contraseña.").css("color", "red").show();
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      loginMessage.text("Usuario no encontrado.").css("color", "red").show();
      return;
    }

    function encryptPassword(password, salt) {
      const saltedPassword = password + salt;
      return CryptoJS.SHA256(saltedPassword).toString();
    }

    const enteredEncryptedPassword = encryptPassword(password, user.salt);

    if (enteredEncryptedPassword === user.password) {
      loginMessage.text(`Bienvenido/a, ${user.name}!`).css("color", "green").show();
      localStorage.setItem("currentUser", JSON.stringify(user));

      window.location.href = user.is_first_login 
        ? "../html/change_password.html" 
        : "../html/admin_page.html";
    } else {
      loginMessage.text("Contraseña incorrecta.").css("color", "red").show();
    }
  });
});
