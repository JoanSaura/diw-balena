$(document).ready(function () {

    if(!currentUser || !currentUser.edit_news) {
        alert("No tens permissos per crear noticiés")
        window.location.href = "../index.html";
        return;
      }

      const NewTitle = $('#news-title').val();
      const NewParagraf = $('#news-paragraf').val();
      
});