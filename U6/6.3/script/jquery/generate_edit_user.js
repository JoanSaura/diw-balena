$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);
  const $form = $(`
    <form id="edit-user-form">
      <h2>Editar Usuari</h2>
      <div>
        <label for="edit-users">Selecciona un usuari a editar:</label>
        <select id="edit-users"></select>
      </div>
      <label for="edit-name">Nom:</label>
      <input type="text" id="edit-name" name="name" placeholder="Introdueix el nom de l'usuari" required />
      <label for="edit-password">Contrasenya:</label>
      <input type="password" id="edit-password" name="password" placeholder="Introdueix la nova contrasenya" required />
      <label for="edit-permission">Permís:</label>
      <div>
        <input type="checkbox" id="edit-create-fiches" name="create_fiches" />
        <label for="edit-create-fiches">Creació de fitxes</label>
      </div>
      <div>
        <input type="checkbox" id="edit-create-news" name="create_news" />
        <label for="edit-create-news">Creació de notícies</label>
      </div>
      <button type="button" id="edit-user-btn">Editar</button>
      <p id="error-message" style="color: red; display: none;"></p>
      <ul id="password-requirements">
        <li>La contrasenya ha de tenir almenys 12 caràcters.</li>
        <li>Ha de contenir almenys una lletra majúscula.</li>
        <li>Ha de contenir almenys una lletra minúscula.</li>
        <li>Ha de contenir almenys un número.</li>
        <li>Ha de contenir almenys un caràcter especial (!@#$%^&*).</li>
      </ul>
    </form>
  `);

  $("#main-content").html($form);

  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const $userSelect = $("#edit-users");

  storedUsers.forEach((user) => {
    $userSelect.append(`<option value="${user.email}">${user.name}</option>`);
  });

  function updateFormFields(selectedUserEmail) {
    const user = storedUsers.find(user => user.email === selectedUserEmail);
    if (user) {
      $("#edit-name").val(user.name);
      $("#edit-password").val(user.password);
      $("#edit-create-fiches").prop("checked", user.edit_bone_files);
      $("#edit-create-news").prop("checked", user.edit_news);
    }
  }

  $("#edit-users").on("change", function () {
    const selectedUserEmail = $(this).val();
    updateFormFields(selectedUserEmail);
  });

  $("#edit-user-btn").on("click", function () {
    const name = $("#edit-name").val();
    const password = $("#edit-password").val();
    const createFiches = $("#edit-create-fiches").is(":checked");
    const createNews = $("#edit-create-news").is(":checked");
    const selectedUserEmail = $("#edit-users").val();

    let errorMessage = "";

    if (!selectedUserEmail) {
      errorMessage = "Si us plau, selecciona un usuari a editar.";
    } else if (!name) {
      errorMessage = "El camp 'Nom' no pot estar buit.";
    } else if (!password) {
      errorMessage = "El camp 'Contrasenya' no pot estar buit.";
    }

    if (errorMessage) {
      $("#error-message").text(errorMessage).show();
      return;
    }

    const userIndex = storedUsers.findIndex(
      (user) => user.email === selectedUserEmail
    );

    if (userIndex !== -1) {
      storedUsers[userIndex].name = name;
      storedUsers[userIndex].password = password;
      storedUsers[userIndex].edit_bone_files = createFiches;
      storedUsers[userIndex].edit_news = createNews;

      localStorage.setItem("users", JSON.stringify(storedUsers));

      $("#error-message")
        .text("Usuari editat correctament!")
        .css("color", "green")
        .show();
    }
  });
});
