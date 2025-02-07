import { createUser } from "../firebase.js";

$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);

  const formHtml = `
    <h2>Formulari de Creació d'Usuari</h2>
    <form id="user-form">
      <label for="name">Nom:</label>
      <input type="text" id="name" placeholder="Nom de l'usuari" required />
      <label for="email">Correu electrònic:</label>
      <input type="email" id="email" placeholder="Correu electrònic" required />
      <label for="password">Contrasenya:</label>
      <input type="password" id="password" placeholder="Contrasenya" required />
      <label for="permissions">Permisos:</label>
      <div>
        <input type="checkbox" id="create-records" />
        <label for="create-records">Crear fitxes</label>
      </div>
      <div>
        <input type="checkbox" id="create-news" />
        <label for="create-news">Crear notícies</label>
      </div>
      <div>
        <input type="checkbox" id="is-admin" />
        <label for="is-admin">Usuari Administrador</label>
      </div>
      <button type="submit" id="submit-user">Crear Usuari</button>
      <ul id="password-requirements">
        <li>La contrasenya ha de tenir almenys 12 caràcters.</li>
        <li>Ha de contenir almenys una lletra majúscula.</li>
        <li>Ha de contenir almenys una lletra minúscula.</li>
        <li>Ha de contenir almenys un número.</li>
        <li>Ha de contenir almenys un caràcter especial (!@#$%^&*).</li>
      </ul>
    </form>
    <p id="error-message" style="color: red; display: none;"></p>
    <p id="success-message" style="color: green; display: none;"></p>
  `;

  $('#main-content').html(formHtml);

  $('#user-form').on('submit', async function (e) {
    e.preventDefault();

    const name = $('#name').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const createRecords = $('#create-records').is(':checked');
    const createNews = $('#create-news').is(':checked');
    const isAdmin = $('#is-admin').is(':checked');  

    let errorMessage = '';

    // Validació dels camps del formulari
    if (!name) {
      errorMessage = 'El nom no pot estar buit.';
    } else if (!email) {
      errorMessage = 'El correu electrònic no pot estar buit.';
    } else if (!password) {
      errorMessage = 'La contrasenya no pot estar buida.';
    } else if (password.length < 12) {
      errorMessage = 'La contrasenya ha de tenir almenys 12 caràcters.';
    } else if (!containsUppercase(password)) {
      errorMessage = 'La contrasenya ha de contenir almenys una lletra majúscula.';
    } else if (!containsLowercase(password)) {
      errorMessage = 'La contrasenya ha de contenir almenys una lletra minúscula.';
    } else if (!containsNumber(password)) {
      errorMessage = 'La contrasenya ha de contenir almenys un número.';
    } else if (!containsSpecialCharacter(password)) {
      errorMessage = 'La contrasenya ha de contenir almenys un caràcter especial.';
    }

    if (errorMessage) {
      $('#error-message').text(errorMessage).show();
      $('#success-message').hide();
      return;
    }

    // Generar un salt i encriptar la contrasenya
    const salt = generateSalt();
    const encryptedPassword = encryptPassword(password, salt);

    // Creació de l'objecte usuari
    const newUser = {
      id: email, // L'ID és el correu electrònic de l'usuari
      name: name,
      email: email,
      password: encryptedPassword, 
      salt: salt, 
      edit_news: createNews,
      edit_bone_files: createRecords,
      is_admin: isAdmin,
      active: true,
      is_first_login: true
    };

    // Guardar l'usuari a LocalStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Guardar l'usuari a Firestore
    await createUser(newUser);

    // Missatge de confirmació i restabliment del formulari
    $('#success-message').text('Usuari creat correctament!').show();
    $('#error-message').hide();
    $('#user-form')[0].reset();
  });

  // Funcions de validació de la contrasenya
  function containsUppercase(password) {
    return /[A-Z]/.test(password);
  }

  function containsLowercase(password) {
    return /[a-z]/.test(password);
  }

  function containsNumber(password) {
    return /[0-9]/.test(password);
  }

  function containsSpecialCharacter(password) {
    return /[!@#$%^&*]/.test(password);
  }

  function generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Base64);
  }

  function encryptPassword(password, salt) {
    return CryptoJS.SHA256(password + salt).toString();
  }
});
