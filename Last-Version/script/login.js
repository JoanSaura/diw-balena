import { createUser, getUserByEmail } from "./firebase.js";

$(document).ready(() => {
  const DEFAULT_USER = {
    id: 1,
    name: "admin",
    email: "desenvolupador@iesjoanramis.org",
    password: "Ramis.20", 
    is_admin: true,
    edit_users: true,
    edit_news: true,
    edit_bone_files: true,
    active: true,
    is_first_login: true,
  };
  console.log("DEFAULT_USER", DEFAULT_USER);

  // 🔹 Función para generar un salt único
  function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Base64);
  }

  // 🔹 Función para cifrar la contraseña con un salt
  function encryptPassword(password, salt) {
    const saltedPassword = password + salt;
    return CryptoJS.SHA256(saltedPassword).toString();
  }

  // 🔹 Inicializa el usuario por defecto en Firestore si no existe
  const initializeDefaultUser = async () => {
    const existingUser = await getUserByEmail(DEFAULT_USER.email);

    if (!existingUser) {
      const salt = generateSalt();
      const encryptedPassword = encryptPassword(DEFAULT_USER.password, salt);

      const newUser = {
        ...DEFAULT_USER,
        password: encryptedPassword, 
        salt: salt, 
      };

      await createUser(newUser);
    }
  };

  initializeDefaultUser(); // Llamamos a la función al cargar la página

  // 🔹 Gestiona el formulario de inicio de sesión
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
