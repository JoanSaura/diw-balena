import { createNews, getNews } from "../firebase.js";

$(document).ready(async function () {
    const addRowBtn = $('#add-row');
    const paragraphTool = $('.tool-paragraph');
    const imageTool = $('.tool-img');
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: 'Usuari' };
    let editingNewsId = null;

    function setDateAndUser() {
        const currentDate = new Date();
        $('#news-date').text(currentDate.toLocaleDateString());
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

                let newElement = `<div class="content-element"></div>`;

                if (type === "paragraph") {
                    newElement = `<div class="content-element"><textarea class="editable"></textarea></div>`;
                } else if (type === "image") {
                    newElement = `<div class="content-element">
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
                $(this).find(".single-element .content-element").each(function (index) {
                    let elementData = {};
                    if ($(this).find("textarea").length) {
                        elementData = {
                            type: "paragraph",
                            content: $(this).find("textarea").val().trim()
                        };
                        hasParagraph = true;
                    } else if ($(this).find("img").length) {
                        elementData = {
                            type: "image",
                            src: $(this).find("img").attr("src")
                        };
                    }
                    singleElement.push(elementData);
                });
                newsContent[`single-element-${rowIndex}`] = singleElement;
            }

            if ($(this).hasClass("double-row")) {
                const doubleElements = {};
                $(this).find(".double-element").each(function (columnIndex) {
                    const column = [];
                    $(this).find(".content-element").each(function (index) {
                        let elementData = {};
                        if ($(this).find("textarea").length) {
                            elementData = {
                                type: "paragraph",
                                content: $(this).find("textarea").val().trim()
                            };
                            hasParagraph = true;
                        } else if ($(this).find("img").length) {
                            elementData = {
                                type: "image",
                                src: $(this).find("img").attr("src")
                            };
                        }
                        column.push(elementData);
                    });
                    doubleElements[`column-${columnIndex}`] = column;
                });
                newsContent[`double-element-${rowIndex}`] = doubleElements;
            }
        });

        if (!title) {
            alert("El títol és obligatori per publicar la notícia.");
            return;
        }
        if (!hasParagraph) {
            alert("És necessari com a mínim un element de text per publicar la notícia.");
            return;
        }

        const currentDate = new Date();
        const author = currentUser.name;

        const newsID = editingNewsId || new Date().getTime();
        await createNews(newsID, title, newsContent, author, currentDate.toLocaleDateString());
        alert("Notícia publicada o actualitzada amb èxit!");
    });

    initializeDroppable();
});
