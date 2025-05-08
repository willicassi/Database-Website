// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("input-title");
    let inputPrice = document.getElementById("input-price");
    let inputPublisher = document.getElementById("input-publisher");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let priceValue = inputPrice.value;
    let publisherValue = inputPublisher.value;

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        price: priceValue,
        name: publisherValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle.value = '';
            inputPrice.value = '';
            inputPublisher.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Books
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let publisherCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.bookID;
    titleCell.innerText = newRow.title;
    priceCell.innerText = newRow.price;
    publisherCell.innerText = newRow.name;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(priceCell);
    row.appendChild(publisherCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Update dropdown menu
    let selectMenu = document.getElementById("input-bookid-update");
    let option = document.createElement("option");
    option.text = newRow.bookID + ' ' +  newRow.title;
    option.value = newRow.bookID;
    selectMenu.add(option);
}
