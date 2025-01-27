document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.getElementById('toggle-accessibility');
  const accessibilityMenu = document.getElementById('accessibility-menu');

  toggleBtn.addEventListener('click', function() {
    accessibilityMenu.classList.toggle('visible');
  });

  const toggleClass = (setting) => {
    const button = document.querySelector(`button[data-setting="${setting}"]`);
    if (button) {
      button.addEventListener('click', () => {
        document.querySelectorAll('*').forEach(el => el.classList.toggle(setting));
      });
    }
  };

  const toggleClassAddRemove = (setting, addClass, removeClass) => {
    const button = document.querySelector(`button[data-setting="${setting}"]`);
    if (button) {
      button.addEventListener('click', () => {
        document.querySelectorAll('*').forEach(el => {
          el.classList.add(addClass);
          el.classList.remove(removeClass);
        });
      });
    }
  };

  toggleClass('grayscale');
  toggleClass('dark-contrast');
  toggleClass('light-contrast');
  toggleClass('high-saturation');
  toggleClass('low-saturation');
  toggleClassAddRemove('increase-font', 'font-large', 'font-small');
  toggleClassAddRemove('decrease-font', 'font-small', 'font-large');
  toggleClassAddRemove('increase-line-spacing', 'line-spacing-large', '');
  toggleClassAddRemove('default-line-spacing', '', 'line-spacing-large');
  toggleClassAddRemove('increase-word-spacing', 'word-spacing-large', '');
  toggleClassAddRemove('increase-letter-spacing', 'letter-spacing-large', '');

  const applyColorChanges = (setting) => {
    const button = document.querySelector(`button[data-setting="${setting}"]`);
    if (button) {
      button.addEventListener('click', () => {
        document.body.classList.toggle(setting);
        document.body.classList.remove(setting === 'high-contrast' ? 'low-contrast' : 'high-contrast');
      });
    }
  };

  applyColorChanges('high-contrast');
  applyColorChanges('low-contrast');
});
