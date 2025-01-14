$(document).ready(function () {
    const addRow = $('#add-row');

    addRow.click(function() {
        const choice = parseInt($('#choice').val());  
        const newsBody = $('#news-body');  

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');  

            singleRow.append(singleElement); 
            newsBody.append(singleRow);  
            singleRow.append(EraseBtn);  

            EraseBtn.click(function() {
                singleRow.remove(); 
            });

        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element element-1"></div>');
            const element2 = $('<div class="double-element element-2"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');  

            doubleRow.append(element1).append(element2);  
            newsBody.append(doubleRow);  
            doubleRow.append(EraseBtn);  

            EraseBtn.click(function() {
                doubleRow.remove();  
            });
        }
    });
});
