$(document).ready(function () {
    const addRowBtn = $('#add-row');
    const paragraphTool = $('.tool-paragraph');
    const imageTool = $('.tool-img');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loginName = document.getElementById("username");

    function setDateAndUser() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        $('#news-date').text(formattedDate);

        const username = currentUser ? currentUser.name : 'Usuario';
        $('#news-username').text('Autor: ' + username);
    }

    setDateAndUser();

    paragraphTool.attr("data-type", "paragraph");
    imageTool.attr("data-type", "image");

    paragraphTool.draggable({
        helper: "clone",
        revert: "invalid",
    });

    imageTool.draggable({
        helper: "clone",
        revert: "invalid",
    });

    function initializeDroppable() {
        $(".blanck-content").droppable({
            accept: ".tool-paragraph, .tool-img",
            drop: function (event, ui) {
                const type = ui.draggable.data("type");

                const isDoubleElement = $(this).hasClass("double-element");
                const currentElements = $(this).children(".content-element").length;

                if ((isDoubleElement && currentElements >= 1) || (!isDoubleElement && currentElements >= 1)) {
                    alert("Aquest espai ja té el nombre màxim d'elements permès.");
                    return;
                }

                let newElement;
                if (type === "paragraph") {
                    newElement = $(`  
                        <div class="content-element">
                            <textarea class="editable"></textarea>
                        </div>
                    `);
                } else if (type === "image") {
                    newElement = $(`  
                        <div class="content-element">
                            <input type="file" accept="image/*" onchange="loadImage(event)" />
                            <img src="" alt="Imatge" style="display: none;">
                        </div>
                    `);
                }

                $(this).find('h3').remove();
                $(this).removeClass("blanck-content");
                $(this).append(newElement);
                makeElementsDraggable();
            }
        });
    }

    function makeElementsDraggable() {
        $(".content-element").draggable({
            helper: "original",
            revert: "invalid",
        });
    }

    addRowBtn.click(function () {
        const choice = parseInt($('#choice').val());
        const newsContainer = $('#news-body');

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            singleRow.append(singleElement);
            newsContainer.append(singleRow);
            eraseContainer.append(eraseButton);
            newsContainer.append(eraseContainer);

            $(".blanck-content").each(function () {
                if ($(this).children('h3').length === 0) {
                    $(this).append('<h3>Espai en blanc</h3>');
                }
            });

            eraseButton.click(function () {
                singleRow.remove();
                eraseContainer.remove();
            });

        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element blanck-content"></div>');
            const element2 = $('<div class="double-element blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            doubleRow.append(element1).append(element2);
            newsContainer.append(doubleRow);
            eraseContainer.append(eraseButton);
            newsContainer.append(eraseContainer);

            $(".blanck-content").each(function () {
                if ($(this).children('h3').length === 0) {
                    $(this).append('<h3>Espai en blanc</h3>');
                }
            });

            eraseButton.click(function () {
                doubleRow.remove();
                eraseContainer.remove();
            });
        }

        initializeDroppable();
    });

    $("#save-config").on("click", function () {
        const rows = [];
        $(".single-row, .double-row").each(function () {
            const row = [];
            $(this).find(".blanck-content").each(function () {
                const column = [];
                $(this).children(".content-element").each(function () {
                    if ($(this).find("textarea").length) {
                        column.push({
                            type: "paragraph",
                            content: $(this).find("textarea").val()
                        });
                    } else if ($(this).find("img").length) {
                        column.push({
                            type: "image",
                            src: $(this).find("img").attr("src")
                        });
                    }
                });
                row.push(column);
            });
            rows.push(row);
        });

        const config = JSON.stringify(rows);
        localStorage.setItem("pageBuilderConfig", config);
        alert("Configuració guardada al navegador.");
    });

    $("#load-config").on("click", function () {
        const config = localStorage.getItem("pageBuilderConfig");
        if (!config) {
            alert("No hi ha cap configuració guardada.");
            return;
        }

        const rows = JSON.parse(config);
        $("#news-body").empty();
        rows.forEach(row => {
            let newRow = '<section class="single-row">';
            row.forEach(column => {
                newRow += column.length > 1 ? `<div class="double-element blanck-content">` : `<div class="single-element blanck-content">`;
                column.forEach(element => {
                    if (element.type === "paragraph") {
                        newRow += ` 
                            <div class="content-element">
                                <textarea class="editable">${element.content}</textarea>
                            </div>`;
                    } else if (element.type === "image") {
                        newRow += ` 
                            <div class="content-element">
                                <img src="${element.src}" alt="Imatge">
                            </div>`;
                    }
                });
                newRow += `</div>`;
            });
            newRow += `<button class="erase-content">Elimina fila</button></section>`;
            $("#news-body").append(newRow);
        });

        initializeDroppable();
        $(".erase-content").click(function () {
            $(this).closest("section").remove();
        });
    });

    initializeDroppable();
});
