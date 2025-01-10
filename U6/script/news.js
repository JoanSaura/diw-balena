document.addEventListener('DOMContentLoaded', () => {
  const newsPosts = document.querySelectorAll('.news-post');
  const body = document.querySelector('body');

  newsPosts.forEach(post => {
    post.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');

      const fullscreenContainer = document.createElement('div');
      fullscreenContainer.classList.add('fullscreen-news');

      const imageSrc = post.getAttribute('data-image') || 'ruta/default/image.jpg';

      fullscreenContainer.innerHTML = `
        <span class="close-button">&times;</span>
        <div class="content-wrapper">
          <img src="${imageSrc}" alt="Imatge de la noticia" />
          <div class="news-content">
            <h1 class="news-title text-3xl">${post.querySelector('.news-title').textContent}</h1>
            <p class="username">${post.querySelector('.username').innerHTML}</p>
            <p>${post.querySelector('p:last-child').textContent}</p>
          </div>
        </div>
      `;

      body.appendChild(overlay);
      body.appendChild(fullscreenContainer);
      body.classList.add('no-scroll');

      const closeButton = fullscreenContainer.querySelector('.close-button');
      const closeModal = () => {
        body.removeChild(fullscreenContainer);
        body.removeChild(overlay);
        body.classList.remove('no-scroll');
      };
      closeButton.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);
    });
  });
});
