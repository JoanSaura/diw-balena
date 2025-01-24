document.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.querySelector('#news-container');
  const body = document.querySelector('body');
  const createNewsButton = document.querySelector('#create-news-btn'); 

  const currentUser = JSON.parse(localStorage.getItem('currentUser')); 

  if (!currentUser) {
    alert('No s’ha detectat cap usuari loguejat. Redirigint a l’inici de sessió...');
    window.location.href = '/login.html'; 
    return;
  }

  const publishedNews = JSON.parse(localStorage.getItem('publishedNews')) || [];

  if (!currentUser.edit_news && createNewsButton) {
    createNewsButton.style.display = 'none';
  }

  console.log(publishedNews);

  function renderNewsPosts() {
    newsContainer.innerHTML = '';
    publishedNews.forEach(news => {
      const post = createNewsPost(news);
      newsContainer.appendChild(post);
      
      post.addEventListener('click', () => openFullscreenModal(news));
    });
  }

  function createNewsPost(news) {
    const post = document.createElement('div');
    post.classList.add('news-post');
    post.setAttribute('data-id', news.id);

    const imageSrc = getImageSrc(news.content);

    post.innerHTML = `
      ${imageSrc ? `<img src="${imageSrc}" alt="Imatge de la notícia" class="news-thumbnail" />` : ''}
      <div class="news-details">
        <h1 class="news-title">${news.title}</h1>
        <p class="username">Autor: ${news.author}</p>
        <p class="date">${news.creationDate}</p>
        <p class="summary">${getSummary(news.content)}</p>
      </div>
    `;

    return post;
  }

  function getImageSrc(content) {
    return content.find(row => row[0]?.type === 'image')?.[0]?.src || null;
  }

  function getSummary(content) {
    const firstContent = content[0]?.[0]?.content;
    return firstContent ? firstContent.substring(0, 100) : '...';
  }

  function openFullscreenModal(news) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.classList.add('fullscreen-news');

    const imageSrc = getImageSrc(news.content);

    fullscreenContainer.innerHTML = `
      <span class="close-button">&times;</span>
      <div class="content-wrapper">
        ${imageSrc ? `<img src="${imageSrc}" alt="Imatge de la notícia" />` : ''}
        <div class="news-content">
          <h1 class="news-title text-3xl">${news.title}</h1>
          <p class="username">Autor: ${news.author}</p>
          <p class="date">${news.creationDate}</p>
          <div class="full-content">
            ${generateContentHTML(news.content)}
          </div>
          ${currentUser.edit_news ? `
            <div class="action-buttons">
              <button class="edit-news-btn">Editar</button>
              <button class="delete-news-btn">Eliminar</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    body.appendChild(overlay);
    body.appendChild(fullscreenContainer);
    body.classList.add('no-scroll');

    const closeButton = fullscreenContainer.querySelector('.close-button');
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    if (currentUser.edit_news) {
      const editButton = fullscreenContainer.querySelector('.edit-news-btn');
      const deleteButton = fullscreenContainer.querySelector('.delete-news-btn');

      editButton.addEventListener('click', () => editNews(news));
      deleteButton.addEventListener('click', () => deleteNews(news.id));
    }

    function closeModal() {
      body.removeChild(fullscreenContainer);
      body.removeChild(overlay);
      body.classList.remove('no-scroll');
    }
  }

  function generateContentHTML(content) {
    return content
      .map(row =>
        row
          .map(column =>
            column
              .map(element => {
                if (element.type === 'paragraph') {
                  return `<p>${element.content}</p>`;
                } else if (element.type === 'image') {
                  return `<img src="${element.src}" alt="Imatge" style="max-width: 100%;" />`;
                }
                return '';
              })
              .join('')
          )
          .join('')
      )
      .join('<hr>');
  }

  function editNews(news) {
    const newTitle = prompt('Editar el títol:', news.title);
    if (newTitle) {
      news.title = newTitle;
      news.modificationDate = new Date().toLocaleDateString();

      localStorage.setItem('publishedNews', JSON.stringify(publishedNews));
      alert('Notícia actualitzada correctament.');
      renderNewsPosts();
      closeModal();
    }
  }

  function deleteNews(newsId) {
    if (confirm('Estàs segur que vols eliminar aquesta notícia?')) {
      const index = publishedNews.findIndex(news => news.id === newsId);
      if (index !== -1) {
        publishedNews.splice(index, 1);
        localStorage.setItem('publishedNews', JSON.stringify(publishedNews));
        alert('Notícia eliminada correctament.');
        renderNewsPosts();
        closeModal();
      }
    }
  }

  renderNewsPosts();
});
