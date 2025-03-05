import { getNews, deleteNews } from "./firebase.js";

$(document).ready(async function () {
    const newsContainer = $("#news-container");
    const body = $("body");
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    async function renderNewsPosts() {
        newsContainer.empty();

        try {
            const publishedNews = await getNews();
            publishedNews.forEach((news) => {
                const post = createNewsPost(news);
                newsContainer.append(post);
                post.on("click", () => openFullscreenModal(news));
            });
        } catch (error) {
            console.error("Error obtenint les notícies des de Firebase:", error);
        }
    }

    function createNewsPost(news) {
        const post = $('<div class="news-post"></div>').attr("data-id", news.id);
        const imageSrc = getImageSrc(news.content) || "../img/huesos-test.jpg";

        const postContent = `
            <img src="${imageSrc}" alt="Notícia imatge" class="new-thumbnail" />
            <div class="news-details">
                <p class="news-title">${news.title || "Sense títol"}</p>
                <p class="username">Autor: ${news.author || "Desconegut"}</p>
                <p class="date">${news.creationDate || "Data no disponible"}</p>
                <p class="summary">${getSummary(news.content)}</p>
            </div>
        `;

        return post.html(postContent);
    }

    function getImageSrc(content) {
        if (!content || typeof content !== "object") return null;

        for (const key in content) {
            if (Array.isArray(content[key])) {
                const imageElement = content[key].find(element => element.type === "image" && element.src);
                if (imageElement) return imageElement.src;
            }
        }
        return null;
    }

    function getSummary(content) {
        if (!content || typeof content !== "object") return "...";

        for (const key in content) {
            if (Array.isArray(content[key])) {
                const paragraphElement = content[key].find(element => element.type === "paragraph" && element.content);
                if (paragraphElement) return paragraphElement.content.substring(0, 100) + "...";
            }
        }
        return "...";
    }

    function openFullscreenModal(news) {
        const overlay = $('<div class="overlay"></div>');
        const fullscreenContainer = $('<div class="fullscreen-news"></div>');

        const imageSrc = getImageSrc(news.content);
        const author = news.author || 'Desconegut';
        const creationDate = news.creationDate || 'Data no disponible';

        fullscreenContainer.html(`
            <span class="close-button">&times;</span>
            <div class="modal-content">
                ${imageSrc ? `<img src="${imageSrc}" alt="Imatge de la notícia" class="content-image"/>` : ''}
                <div class="news-content">
                    <div class="fullscreen-important-data">
                        <p>
                            <span class="news-title">Títol: ${news.title}</span> | 
                            <span class="username">Autor: ${author}</span> | 
                            <span class="date">Escrita: ${creationDate}</span>
                        </p>
                    </div>
                    <div class="full-content">
                        ${generateContentHTML(news.content, imageSrc)}
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

        body.append(overlay).append(fullscreenContainer).addClass('modal-open');

        fullscreenContainer.find('.close-button').on('click', closeModal);
        overlay.on('click', closeModal);

        if (currentUser.edit_news) {
            fullscreenContainer.find('.delete-news-btn').on('click', async () => {
                if (confirm("Estàs segur que vols eliminar aquesta notícia?")) {
                    await deleteNews(news.id);
                    closeModal();
                    renderNewsPosts();
                    alert("Notícia eliminada correctament.");
                }
            });
        }

        function closeModal() {
            body.removeClass('modal-open');
            overlay.remove();
            fullscreenContainer.remove();
        }
    }

    function generateContentHTML(content, mainImageSrc) {
        if (!content || typeof content !== "object") return "";

        let html = "";

        for (const key in content) {
            if (Array.isArray(content[key])) {
                content[key].forEach(element => {
                    if (element.type === "paragraph" && element.content) {
                        html += `<p class="content-paragraph">${element.content}</p>`;
                    } else if (element.type === "image" && element.src && element.src !== mainImageSrc) {
                        html += `<img src="${element.src}" alt="Imatge" class="content-image" />`;
                    }
                });
            } else if (typeof content[key] === "object") {
                Object.values(content[key]).flat().forEach(element => {
                    if (element.type === "paragraph" && element.content) {
                        html += `<p class="content-paragraph">${element.content}</p>`;
                    } else if (element.type === "image" && element.src && element.src !== mainImageSrc) {
                        html += `<img src="${element.src}" alt="Imatge" class="content-image" />`;
                    }
                });
            }
        }

        return html;
    }

    await renderNewsPosts();
});
