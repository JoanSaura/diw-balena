$(document).ready(function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!currentUser) {
      window.location.href = 'login.html';
    }
  
    console.log("Per a l'usuari admin jo empreare '*Ramis2024/25*' com a contrasenya");
    
  
    $('#login').on('submit', function (e) {
      e.preventDefault();
  
      const newPassword = $('#new-password').val();
      const confirmPassword = $('#confirm-password').val();
      const passwordMessage = $('#password-message');
  
      passwordMessage.hide().text('');
  
      let errorMessage = '';
  
      if (!newPassword || !confirmPassword) {
        errorMessage = 'Tots els camps són obligatoris.';
      } else if (newPassword !== confirmPassword) {
        errorMessage = 'Les contrasenyes no coincideixen.';
      } else if (newPassword.length < 12) {
        errorMessage = 'La contrasenya ha de tenir almenys 12 caràcters.';
      } else if (!containsUppercase(newPassword)) {
        errorMessage = 'La contrasenya ha de contenir almenys una lletra majúscula.';
      } else if (!containsLowercase(newPassword)) {
        errorMessage = 'La contrasenya ha de contenir almenys una lletra minúscula.';
      } else if (!containsNumber(newPassword)) {
        errorMessage = 'La contrasenya ha de contenir almenys un número.';
      } else if (!containsSpecialCharacter(newPassword)) {
        errorMessage = 'La contrasenya ha de contenir almenys un caràcter especial.';
      }
  
      if (errorMessage) {
        passwordMessage.text(errorMessage).show();
        return;
      }
  
      passwordMessage.css('color', 'green').text('Contrasenya canviada correctament!').show();
  
      currentUser.password = newPassword;
      currentUser.is_first_login = false;
  
      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = storedUsers.findIndex(user => user.email === currentUser.email);
      if (userIndex !== -1) {
        storedUsers[userIndex] = currentUser;
        localStorage.setItem("users", JSON.stringify(storedUsers));
      }
  
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
      window.location.href = 'admin_page.html';
    });
  
    function containsUppercase(password) {
      for (let char of password) {
        if (char >= 'A' && char <= 'Z') {
          return true;
        }
      }
      return false;
    }
  
    function containsLowercase(password) {
      for (let char of password) {
        if (char >= 'a' && char <= 'z') {
          return true;
        }
      }
      return false;
    }
  
    function containsNumber(password) {
      for (let char of password) {
        if (char >= '0' && char <= '9') {
          return true;
        }
      }
      return false;
    }
  
    function containsSpecialCharacter(password) {
      const specialCharacters = "!@#$%^&*()_+{}[]:;<>,.?~\\-";
      for (let char of password) {
        if (specialCharacters.includes(char)) {
          return true;
        }
      }
      return false;
    }
  });
  