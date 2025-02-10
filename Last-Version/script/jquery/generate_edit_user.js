import { getUsers, getUserByEmail, editUser } from "../firebase.js";

$(document).ready(async function () {
  console.log("Cargando formulario de edición...");

  const $form = $(`
    <form id="edit-user-form">
      <h2>Editar Usuari</h2>
      <div>
        <label for="edit-users">Selecciona un usuari a editar:</label>
        <select id="edit-users"></select>
      </div>
      <label for="edit-name">Nom:</label>
      <input type="text" id="edit-name" name="name" required />
      <label for="edit-password">Contrasenya:</label>
      <input type="password" id="edit-password" name="password" required />
      <label for="edit-permission">Permisos:</label>
      <div>
        <input type="checkbox" id="edit-create-fiches" name="edit_bone_files" />
        <label for="edit-create-fiches">Creació de fitxes</label>
      </div>
      <div>
        <input type="checkbox" id="edit-create-news" name="edit_news" />
        <label for="edit-create-news">Creació de notícies</label>
      </div>
      <div>
        <input type="checkbox" id="edit-create-users" name="edit_users" />
        <label for="edit-create-users">Edició d'usuaris</label>
      </div>
      <button type="button" id="edit-user-btn">Editar</button>
      <p id="error-message" style="color: red; display: none;"></p>
    </form>
  `);

  $("#main-content").html($form);

  const $userSelect = $("#edit-users");

  // Cargar usuarios desde Firestore
  async function loadUsers() {
    const users = await getUsers();
    $userSelect.empty().append('<option value="">Selecciona un usuari</option>');

    users.forEach(user => {
      $userSelect.append(`<option value="${user.id}">${user.name}</option>`);
    });
  }

  // Cargar usuarios al iniciar
  await loadUsers();

  // Actualizar formulario con datos del usuario seleccionado
  async function updateFormFields(selectedUserEmail) {
    if (!selectedUserEmail) return;

    const user = await getUserByEmail(selectedUserEmail);
    if (user) {
      $("#edit-name").val(user.name);
      $("#edit-password").val(""); // No mostrar la contraseña original
      $("#edit-create-fiches").prop("checked", user.edit_bone_files || false);
      $("#edit-create-news").prop("checked", user.edit_news || false);
      $("#edit-create-users").prop("checked", user.edit_users || false);
    }
  }

  // Escuchar cambios en el <select>
  $userSelect.on("change", function () {
    const selectedUserEmail = $(this).val();
    updateFormFields(selectedUserEmail);
  });

  // Guardar cambios en Firebase
  $("#edit-user-btn").on("click", async function () {
    const selectedUserEmail = $("#edit-users").val();
    const name = $("#edit-name").val();
    const password = $("#edit-password").val();
    const editBoneFiles = $("#edit-create-fiches").is(":checked");
    const editNews = $("#edit-create-news").is(":checked");
    const editUsers = $("#edit-create-users").is(":checked");

    if (!selectedUserEmail) {
      $("#error-message").text("Si us plau, selecciona un usuari a editar.").show();
      return;
    }
    if (!name || !password) {
      $("#error-message").text("El nom i la contrasenya no poden estar buits.").show();
      return;
    }

    const userData = { name, password, edit_bone_files: editBoneFiles, edit_news: editNews, edit_users: editUsers };

    await editUser(selectedUserEmail, userData);
    $("#error-message").text("Usuari editat correctament!").css("color", "green").show();
  });
});
