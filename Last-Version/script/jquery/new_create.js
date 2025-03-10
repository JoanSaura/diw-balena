import { getNews, publishNews, saveDraft, getDrafts } from "../firebase.js";

$(document).ready(async function () {
    const addRowBtn = $('#add-row');
    const paragraphTool = $('.tool-paragraph');
    const imageTool = $('.tool-img');
    const newsDropdown = $('#news-dropdown');
    const draftsDropdown = $('#drafts-dropdown');
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: 'Usuari' };
    let editingNewsId = null;
    let editingDraftId = null;

    function setDateAndUser() {
        const currentDate = new Date();
        $('#news-date').text(currentDate.toLocaleDateString());
        $('#news-username').text('Autor: ' + currentUser.name);
    }

    async function loadNewsIntoSelect() {
        const news = await getNews();
        newsDropdown.empty();
        newsDropdown.append('<option value="">Tria</option>');
        news.forEach(item => {
            newsDropdown.append(`<option value="${item.id}">${item.title}</option>`);
        });
    }

    async function loadDraftsIntoSelect() {
        const drafts = await getDrafts();
        draftsDropdown.empty();
        draftsDropdown.append('<option value="">Tria un esborrany</option>');
        drafts.forEach(item => {
            draftsDropdown.append(`<option value="${item.id}">${item.title}</option>`);
        });
    }

    async function loadContent(id, type) {
        try {
            const data = type === 'news' ? await getNews() : await getDrafts();
            const selectedItem = data.find(item => String(item.id) === String(id));
            if (!selectedItem) return;

            $('#news-title').val(selectedItem.title);
            $('#news-body').empty();
            const content = selectedItem.content;
            const editingId = type === 'news' ? editingNewsId : editingDraftId;
            if (type === 'news') editingNewsId = selectedItem.id;
            else editingDraftId = selectedItem.id;

            Object.entries(content).forEach(([key, value]) => {
                let row;
                if (key.startsWith('single-element')) {
                    row = $('<section class="single-row"></section>');
                    const singleElement = $('<div class="single-element"></div>');
                    if (Array.isArray(value)) {
                        value.forEach(element => {
                            const contentDiv = $('<div class="content-element"></div>');
                            if (element.type === 'paragraph') {
                                const textarea = $('<textarea class="editable"></textarea>').val(element.content);
                                contentDiv.append(textarea);
                            } else if (element.type === 'image') {
                                const imgElement = `<img src="${element.src}" alt="Imatge" style="display: block; max-width: 100%; height: auto;">`;
                                const imageInput = `<input type="file" accept="image/*" class="image-input" data-base64="${element.src}"/>`;
                                contentDiv.append(imageInput).append(imgElement);
                            }
                            singleElement.append(contentDiv);
                        });
                    }
                    row.append(singleElement);
                } else if (key.startsWith('double-element')) {
                    row = $('<section class="double-row"></section>');
                    Object.values(value).forEach(column => {
                        const doubleElement = $('<div class="double-element"></div>');
                        if (Array.isArray(column)) {
                            column.forEach(element => {
                                const contentDiv = $('<div class="content-element"></div>');
                                if (element.type === 'paragraph') {
                                    const textarea = $('<textarea class="editable"></textarea>').val(element.content);
                                    contentDiv.append(textarea);
                                } else if (element.type === 'image') {
                                    const imgElement = `<img src="${element.src}" alt="Imatge" style="display: block; max-width: 100%; height: auto;">`;
                                    const imageInput = `<input type="file" accept="image/*" class="image-input" data-base64="${element.src}"/>`;
                                    contentDiv.append(imageInput).append(imgElement);
                                }
                                doubleElement.append(contentDiv);
                            });
                        }
                        row.append(doubleElement);
                    });
                }

                const eraseButton = $('<button class="erase-content">Elimina fila</button>');
                $('#news-body').append(row).append(eraseButton);
            });

            initializeDroppable();
            bindEraseButtons();
            bindDeleteButtons();
            bindImageUpload();
        } catch (error) {
            console.error(`Error al carregar el ${type}:`, error);
            alert(`Error al carregar el ${type}`);
        }
    }

    paragraphTool.attr("data-type", "paragraph").draggable({ helper: "clone", revert: "invalid" });
    imageTool.attr("data-type", "image").draggable({ helper: "clone", revert: "invalid" });

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

                let newElement = type === "paragraph"
                    ? `<div class="content-element"><textarea class="editable"></textarea></div>`
                    : `<div class="content-element">
                        <input type="file" accept="image/*" class="image-input"/>
                        <img src="" alt="Imatge" style="display: none; max-width: 100%; height: auto;">
                       </div>`;

                $(this).find('h3').remove();
                $(this).removeClass("blanck-content").append(newElement);
                bindDeleteButtons();
                bindImageUpload();
            }
        });
    }

    function bindDeleteButtons() {
        $(".delete-btn").off("click").on("click", function () {
            const parent = $(this).closest(".content-element");
            const container = parent.closest(".single-element, .double-element");
            parent.remove();
            if (container.children(".content-element").length === 0) {
                container.addClass("blanck-content").append('<h3>Espai en blanc</h3>');
            }
        });
    }

    function bindEraseButtons() {
        $('.erase-content').off("click").on("click", function () {
            const row = $(this).prev();
            row.remove();
            $(this).remove();
        });
    }

    function bindImageUpload() {
        $(".image-input").off("change").on("change", function (event) {
            const file = event.target.files[0];
            const imgElement = $(this).siblings("img");

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imgElement.attr("src", e.target.result).show();
                    $(event.target).attr("data-base64", e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    newsDropdown.on('change', function () {
        const selectedNewsId = $(this).val();
        if (selectedNewsId) {
            loadContent(selectedNewsId, 'news');
        } else {
            $('#news-title').val('');
            $('#news-body').empty();
            editingNewsId = null;
        }
    });

    draftsDropdown.on('change', function () {
        const selectedDraftId = $(this).val();
        if (selectedDraftId) {
            loadContent(selectedDraftId, 'draft');
        } else {
            $('#news-title').val('');
            $('#news-body').empty();
            editingDraftId = null;
        }
    });

    addRowBtn.click(function () {
        const choice = parseInt($('#choice').val());
        const newsContainer = $('#news-body');

        let row;
        if (choice === 1) {
            row = $('<section class="single-row"></section>');
            row.append('<div class="single-element blanck-content"><h3>Espai en blanc</h3></div>');
        } else if (choice === 2) {
            row = $('<section class="double-row"></section>');
            row.append('<div class="double-element blanck-content"><h3>Espai en blanc</h3></div>');
            row.append('<div class="double-element blanck-content"><h3>Espai en blanc</h3></div>');
        }

        if (row) {
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');
            newsContainer.append(row).append(eraseButton);
            eraseButton.click(function () {
                row.remove();
                $(this).remove();
            });

            initializeDroppable();
            bindDeleteButtons();
        }
    });

    $("#publish").on("click", async function () {
        const title = $('#news-title').val().trim();
        const rows = $(".single-row, .double-row");
        let hasParagraph = false;
        const newsContent = {};

        rows.each(function (rowIndex) {
            if ($(this).hasClass("single-row")) {
                const singleElement = [];
                $(this).find(".single-element .content-element").each(function () {
                    let elementData = {};
                    if ($(this).find("textarea").length) {
                        elementData = {
                            type: "paragraph",
                            content: $(this).find("textarea").val().trim()
                        };
                        hasParagraph = true;
                    } else if ($(this).find("img").length) {
                        const base64Image = $(this).find(".image-input").attr("data-base64");
                        if (base64Image) {
                            elementData = {
                                type: "image",
                                src: base64Image
                            };
                        }
                    }
                    if (Object.keys(elementData).length > 0) {
                        singleElement.push(elementData);
                    }
                });
                if (singleElement.length > 0) {
                    newsContent[`single-element-${rowIndex}`] = singleElement;
                }
            }

            if ($(this).hasClass("double-row")) {
                const doubleElements = {};
                $(this).find(".double-element").each(function (columnIndex) {
                    const column = [];
                    $(this).find(".content-element").each(function () {
                        let elementData = {};
                        if ($(this).find("textarea").length) {
                            elementData = {
                                type: "paragraph",
                                content: $(this).find("textarea").val().trim()
                            };
                            hasParagraph = true;
                        } else if ($(this).find("img").length) {
                            const base64Image = $(this).find(".image-input").attr("data-base64");
                            if (base64Image) {
                                elementData = {
                                    type: "image",
                                    src: base64Image
                                };
                            }
                        }
                        if (Object.keys(elementData).length > 0) {
                            column.push(elementData);
                        }
                    });
                    if (column.length > 0) {
                        doubleElements[`column-${columnIndex}`] = column;
                    }
                });
                if (Object.keys(doubleElements).length > 0) {
                    newsContent[`double-element-${rowIndex}`] = doubleElements;
                }
            }
        });

        if (!title || !hasParagraph) {
            alert(!title ? "El títol és obligatori per publicar la notícia." : "És necessari com a mínim un element de text per publicar la notícia.");
            return;
        }

        try {
            const currentDate = new Date();
            await publishNews(
                editingNewsId || new Date().getTime(),
                title,
                newsContent,
                currentUser.name,
                currentDate.toLocaleDateString()
            );
            alert("Notícia publicada o actualitzada amb èxit!");
            await loadNewsIntoSelect();
            await loadDraftsIntoSelect();
        } catch (error) {
            console.error('Error al guardar la notícia:', error);
            alert('Error al guardar la notícia');
        }
    });

    $("#save-config").on("click", async function () {
        const title = $('#news-title').val().trim();
        const newsContent = {};

        $(".single-row, .double-row").each(function (rowIndex) {
            if ($(this).hasClass("single-row")) {
                const singleElement = [];
                $(this).find(".single-element .content-element").each(function () {
                    let elementData = {};
                    if ($(this).find("textarea").length) {
                        elementData = {
                            type: "paragraph",
                            content: $(this).find("textarea").val().trim()
                        };
                    } else if ($(this).find("img").length) {
                        const base64Image = $(this).find(".image-input").attr("data-base64");
                        if (base64Image) {
                            elementData = {
                                type: "image",
                                src: base64Image
                            };
                        }
                    }
                    if (Object.keys(elementData).length > 0) {
                        singleElement.push(elementData);
                    }
                });
                if (singleElement.length > 0) {
                    newsContent[`single-element-${rowIndex}`] = singleElement;
                }
            }

            if ($(this).hasClass("double-row")) {
                const doubleElements = {};
                $(this).find(".double-element").each(function (columnIndex) {
                    const column = [];
                    $(this).find(".content-element").each(function () {
                        let elementData = {};
                        if ($(this).find("textarea").length) {
                            elementData = {
                                type: "paragraph",
                                content: $(this).find("textarea").val().trim()
                            };
                        } else if ($(this).find("img").length) {
                            const base64Image = $(this).find(".image-input").attr("data-base64");
                            if (base64Image) {
                                elementData = {
                                    type: "image",
                                    src: base64Image
                                };
                            }
                        }
                        if (Object.keys(elementData).length > 0) {
                            column.push(elementData);
                        }
                    });
                    if (column.length > 0) {
                        doubleElements[`column-${columnIndex}`] = column;
                    }
                });
                if (Object.keys(doubleElements).length > 0) {
                    newsContent[`double-element-${rowIndex}`] = doubleElements;
                }
            }
        });

        if (!title) {
            alert("El títol és obligatori per desar el esborrany.");
            return;
        }

        try {
            await saveDraft(editingDraftId || new Date().getTime(), title, newsContent, currentUser.name);
            alert("Esborrany desat!");
            await loadDraftsIntoSelect();
            $('#news-body').empty();
            $('#news-title').val('');
        } catch (error) {
            console.error("Error al guardar el esborrany:", error);
            alert("Error al guardar el esborrany");
        }
    });

    setDateAndUser();
    await loadNewsIntoSelect();
    await loadDraftsIntoSelect();
});
