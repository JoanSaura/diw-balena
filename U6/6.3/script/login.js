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

  // Funció per generar un salt únic
  function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Base64);
  }

  // Funció per xifrar la contrasenya amb un salt
  function encryptPassword(password, salt) {
    const saltedPassword = password + salt;
    return CryptoJS.SHA256(saltedPassword).toString();
  }

  // Inicialitza l'usuari per defecte al localStorage si no existeix
  const initializeDefaultUser = () => {
    console.log(DEFAULT_USER);
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const defaultUserExists = storedUsers.some(
      (user) => user.email === DEFAULT_USER.email
    );

    if (!defaultUserExists) {
      const salt = generateSalt(); // Generar un salt únic per a l'usuari
      const encryptedPassword = encryptPassword(DEFAULT_USER.password, salt); // Xifrar la contrasenya

      const newUser = {
        ...DEFAULT_USER,
        password: encryptedPassword, // Emmagatzemar el hash
        salt: salt, // Emmagatzemar el salt juntament amb el hash
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      console.log("Usuari per defecte creat");
    }
  };

  initializeDefaultUser();

  // Gestiona el formulari d'inici de sessió
  $("#login").on("submit", (e) => {
    e.preventDefault();

    // Obtenim els camps de correu electrònic i contrasenya introduïts
    const email = $("#login input[type='text']").val().trim();
    const password = $("#login input[type='password']").val().trim();

    const loginMessage = $("#login-message"); // Element per mostrar missatges d'error o èxit
    loginMessage.hide(); // Amagar els missatges a l'inici

    if (!email || !password) {
      // Mostrar error si falten camps
      loginMessage.text("Si us plau, introdueix tant el correu electrònic com la contrasenya.");
      loginMessage.css("color", "red");
      loginMessage.show();
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find((user) => user.email === email);

    if (!user) {
      // Mostrar error si l'usuari no existeix
      loginMessage.text("Usuari no trobat. Si us plau, comprova el teu correu electrònic.");
      loginMessage.css("color", "red");
      loginMessage.show();
      return;
    }

    // Xifrar la contrasenya introduïda amb el salt emmagatzemat
    const enteredEncryptedPassword = encryptPassword(password, user.salt);

    if (enteredEncryptedPassword === user.password) {
      // Mostrar missatge d'èxit si la contrasenya és correcta
      loginMessage.text(`Benvingut/da, ${user.name}! Has iniciat sessió correctament.`);
      loginMessage.css("color", "green");
      loginMessage.show();

      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.is_first_login) {
        window.location.href = "../html/change_password.html";
      } else {
        window.location.href = "../html/admin_page.html";
      }
    } else {
      // Mostrar error si la contrasenya és incorrecta
      loginMessage.text("Contrasenya incorrecta. Si us plau, prova de nou.");
      loginMessage.css("color", "red");
      loginMessage.show();
    }
  });
});
