$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.is_admin) {
    window.location.href = "../index.html";
    return;
  }

  const createButtons = () => {
    const buttonsHtml = `
      <div class="button-container">
        <h1>Pàgina d'administrador</h1>
        <a href="../html/admin/create_users.html">
          <button id="create-user-btn" class="button-link">Creació d'Usuaris</button>
        </a>
        <a href="../html/admin/edit_users.html">
          <button id="edit-user-btn" class="button-link">Edició d'Usuaris</button>
        </a>
      </div>
    `;

    $('#main-content').html(buttonsHtml);
  };

  createButtons();
});
