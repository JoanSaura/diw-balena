$(document).ready(function () {

    if(!currentUser || !currentUser.edit_news) {
        alert("No tens permissos per crear noticiés")
        window.location.href = "../index.html";
        return;
      }

    
});