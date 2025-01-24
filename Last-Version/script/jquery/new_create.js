$(document).ready(function () {
    const addRowBtn = $('#add-row');
    const paragraphTool = $('.tool-paragraph');
    const imageTool = $('.tool-img');
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: 'Usuari' };
    let editingNewsId = null; 

    function setDateAndUser() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        $('#news-date').text(formattedDate);
        $('#news-username').text('Autor: ' + currentUser.name);
    }

    setDateAndUser();

    paragraphTool.attr("data-type", "paragraph");
    imageTool.attr("data-type", "image");

    paragraphTool.draggable({ helper: "clone", revert: "invalid" });
    imageTool.draggable({ helper: "clone", revert: "invalid" });

    function initializeDroppable() {
        $(".blanck-content").droppable({
            accept: ".tool-paragraph, .tool-img",
            drop: function (event, ui) {
                const type = ui.draggable.data("type");

                const isDoubleElement = $(this).hasClass("double-element");
                const currentElements = $(this).children(".content-element").length;

                if ((isDoubleElement && currentElements >= 2) || (!isDoubleElement && currentElements >= 1)) {
                    alert("Aquest espai ja té el nombre màxim d'elements permès.");
                    return;
                }

                let newElement;
                if (type === "paragraph") {
                    newElement = `
                        <div class="content-element">
                            <textarea class="editable"></textarea>
                        </div>`;
                } else if (type === "image") {
                    newElement = `
                        <div class="content-element">
                            <input type="file" accept="image/*" onchange="loadImage(event, this)" />
                            <img src="" alt="Imatge" style="display: none; max-width: 100%; height: auto;">
                        </div>`;
                }

                $(this).find('h3').remove();
                $(this).removeClass("blanck-content");
                $(this).append(newElement);
                bindDeleteButtons();
            }
        });
    }

    function bindDeleteButtons() {
        $(".delete-btn").off("click").on("click", function () {
            const parent = $(this).closest(".content-element");
            const container = parent.closest(".blanck-content");

            parent.remove();

            if (container.children(".content-element").length === 0) {
                container.addClass("blanck-content");
                container.append('<h3>Espai en blanc</h3>');
            }
        });
    }

    function loadImage(event, input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $(input).siblings("img").attr("src", e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    }

    function populateNewsDropdown() {
        const newsDropdown = $('#news-dropdown');
        const publishedNews = JSON.parse(localStorage.getItem("publishedNews")) || [];

        newsDropdown.empty();
        newsDropdown.append('<option value="">Tria una noticia...</option>');

        publishedNews.forEach(news => {
            const option = $('<option></option>').val(news.id).text(news.title);
            newsDropdown.append(option);
        });
    }

    function loadNewsContent(newsId) {
        const publishedNews = JSON.parse(localStorage.getItem("publishedNews")) || [];
        const news = publishedNews.find(n => n.id == newsId);

        if (!news) return;

        editingNewsId = news.id; 
        $('#news-title').val(news.title);
        $('#news-body').empty();

        news.content.forEach(row => {
            const rowElement = $('<section class="single-row"></section>');

            row.forEach(column => {
                const newElement = $('<div class="content-element"></div>');

                column.forEach(element => {
                    if (element.type === "paragraph") {
                        const textArea = $('<textarea class="editable"></textarea>').val(element.content);
                        newElement.append(textArea);
                    } else if (element.type === "image") {
                        const imgInput = $('<input type="file" accept="image/*" onchange="loadImage(event, this)" />');
                        const img = $('<img src="' + element.src + '" alt="Imatge" style="max-width: 100%; height: auto;">');
                        newElement.append(imgInput).append(img);
                    }
                });

                rowElement.append(newElement);
            });

            if (rowElement.find('.content-element').length === 0) {
                const emptyElement = $('<div class="content-element blanck-content"><h3>Espai en blanc</h3></div>');
                rowElement.append(emptyElement);
            }

            $('#news-body').append(rowElement);
        });

        initializeDroppable();
        bindDeleteButtons();
    }

    $('#news-dropdown').change(function () {
        const selectedNewsId = $(this).val();
        if (selectedNewsId) {
            loadNewsContent(selectedNewsId);
        }
    });

    addRowBtn.click(function () {
        const choice = parseInt($('#choice').val());
        const newsContainer = $('#news-body');

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element blanck-content"><h3>Espai en blanc</h3></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            singleRow.append(singleElement);
            newsContainer.append(singleRow).append(eraseButton);

            eraseButton.click(function () {
                singleRow.remove();
                $(this).remove();
            });
        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element blanck-content"><h3>Espai en blanc</h3></div>');
            const element2 = $('<div class="double-element blanck-content"><h3>Espai en blanc</h3></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            doubleRow.append(element1).append(element2);
            newsContainer.append(doubleRow).append(eraseButton);

            eraseButton.click(function () {
                doubleRow.remove();
                $(this).remove();
            });
        }

        initializeDroppable();
        bindDeleteButtons();
    });

    $("#publish").on("click", function () {
        const title = $('#news-title').val().trim();
        const rows = $(".single-row, .double-row");
        let hasParagraph = false;

        const rowsData = [];

        rows.each(function () {
            const row = [];
            $(this).find(".single-element, .double-element").each(function () {
                const column = [];
                $(this).children(".content-element").each(function () {
                    if ($(this).find("textarea").length) {
                        const textContent = $(this).find("textarea").val().trim();
                        if (textContent) {
                            hasParagraph = true;
                            column.push({
                                type: "paragraph",
                                content: textContent,
                            });
                        }
                    } else if ($(this).find("img").length) {
                        const imgSrc = $(this).find("img").attr("src");
                        if (imgSrc) {
                            column.push({
                                type: "image",
                                src: imgSrc,
                            });
                        }
                    }
                });
                row.push(column);
            });
            rowsData.push(row);
        });

        if (!title) {
            alert("El títol és obligatori per publicar la notícia.");
            return;
        }
        if (!hasParagraph) {
            alert("És necessari com a mínim un element de text per publicar la notícia.");
            return;
        }

        const publishedNews = JSON.parse(localStorage.getItem("publishedNews")) || [];

        if (editingNewsId) {
            const newsIndex = publishedNews.findIndex(news => news.id === editingNewsId);
            if (newsIndex !== -1) {
                publishedNews[newsIndex].title = title;
                publishedNews[newsIndex].content = rowsData;
            }
            alert("Notícia actualitzada amb èxit!");
        } else {
            
            const newsID = new Date().getTime();
            const author = currentUser.name;
            const creationDate = new Date().toLocaleDateString();

            const newsData = {
                id: newsID,
                title: title,
                author: author,
                creationDate: creationDate,
                content: rowsData,
            };

            publishedNews.push(newsData);
            alert("Notícia publicada amb èxit!");
        }

        localStorage.setItem("publishedNews", JSON.stringify(publishedNews));
        populateNewsDropdown();
        editingNewsId = null; 
    });

    populateNewsDropdown();
});
