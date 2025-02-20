import { getNews, deleteNews } from "./firebase.js"; 

$(document).ready(async function () {
    const newsContainer = $('#news-container');
    const body = $('body');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    async function renderNewsPosts() {
        newsContainer.empty(); 
        
        try {
            const publishedNews = await getNews();

            publishedNews.forEach(news => {
                const post = createNewsPost(news);
                newsContainer.append(post);
                post.on('click', () => openFullscreenModal(news));
            });
        } catch (error) {
            console.error("Error obtenint les notícies des de Firebase:", error);
        }
    }

    function createNewsPost(news) {
        const post = $('<div class="news-post"></div>');
        post.attr('data-id', news.id);

        const imageSrc = getImageSrc(news.content);
        const author = news.author || 'Desconegut';
        const creationDate = news.creationDate || 'Data no disponible';
        const title = news.title || 'Sense títol';

        const postContent = `
            ${imageSrc ? `<img src="${imageSrc}" alt="Imatge de la notícia" class="news-thumbnail" />` : ''}
            <div class="news-details">
                <p class="news-title">${title}</p>
                <p class="username">Autor: ${author}</p>
                <p class="date">${creationDate}</p>
                <p class="summary">${getSummary(news.content)}</p>
            </div>
        `;
        post.html(postContent);

        return post;
    }

    function getImageSrc(content) {
        if (!content || typeof content !== 'object') return null;

        for (const key in content) {
            if (Array.isArray(content[key])) {
                for (const element of content[key]) {
                    if (element.type === 'image' && element.src) {
                        return element.src;
                    }
                }
            }
        }
        return null;
    }

    function getSummary(content) {
        if (!content || typeof content !== 'object') return '...';

        for (const key in content) {
            if (Array.isArray(content[key])) {
                for (const element of content[key]) {
                    if (element.type === 'paragraph' && element.content) {
                        return element.content.substring(0, 100);
                    }
                }
            }
        }
        return '...';
    }

    function openFullscreenModal(news) {
        const overlay = $('<div class="overlay"></div>');
        const fullscreenContainer = $('<div class="fullscreen-news"></div>');

        const imageSrc = getImageSrc(news.content);
        const author = news.author || 'Desconegut';
        const creationDate = news.creationDate || 'Data no disponible';

        fullscreenContainer.html(`
            <span class="close-button">&times;</span>
            <div class="content-wrapper">
                ${imageSrc ? `<img src="${imageSrc}" alt="Imatge de la notícia" />` : ''}
                <div class="news-content">
                    <p class="news-title">${news.title}</p>
                    <p class="username">Autor: ${author}</p>
                    <p class="date">${creationDate}</p>
                    <div class="full-content">
                        ${generateContentHTML(news.content)}
                    </div>
                    ${currentUser.edit_news ? `
                        <div class="action-buttons">
                            <button class="delete-news-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                Eliminar
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `);

        body.append(overlay).append(fullscreenContainer);
        body.addClass('no-scroll');

        const closeButton = fullscreenContainer.find('.close-button');
        closeButton.on('click', closeModal);
        overlay.on('click', closeModal);

        if (currentUser.edit_news) {
            const deleteButton = fullscreenContainer.find('.delete-news-btn');
            deleteButton.on('click', async () => {
                const confirmDelete = confirm("Estàs segur que vols eliminar aquesta notícia?");
                if (confirmDelete) {
                    await deleteNews(news.id);
                    closeModal();
                    renderNewsPosts();
                    alert("Notícia eliminada correctament.");
                }
            });
        }

        function closeModal() {
            body.removeClass('no-scroll');
            overlay.remove();
            fullscreenContainer.remove();
        }
    }

    function generateContentHTML(content) {
        if (!content || typeof content !== 'object') return '';
    
        let html = '';
        
        for (const key in content) {
            if (Array.isArray(content[key])) {
                content[key].forEach(element => {
                    if (element.type === 'paragraph' && element.content) {
                        html += `<p>${element.content}</p>`;
                    } else if (element.type === 'image' && element.src) {
                        html += `<img src="${element.src}" alt="Imatge" style="max-width: 100%;" />`;
                    }
                });
            } 
            
            // Manejar elementos tipo "double-element-*"
            else if (typeof content[key] === 'object') {
                for (const subKey in content[key]) {
                    if (Array.isArray(content[key][subKey])) {
                        content[key][subKey].forEach(element => {
                            if (element.type === 'paragraph' && element.content) {
                                html += `<p>${element.content}</p>`;
                            } else if (element.type === 'image' && element.src) {
                                html += `<img src="${element.src}" alt="Imatge" style="max-width: 100%;" />`;
                            }
                        });
                    }
                }
            }
        }
    
        return html;
    }
        
    

    await renderNewsPosts();
});
