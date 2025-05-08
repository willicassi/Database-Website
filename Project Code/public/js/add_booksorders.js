// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addBookOrderForm = document.getElementById('add-booksorders-form-ajax');

// Modify the objects we need
addBookOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-orderid");
    let inputBookID = document.getElementById("input-bookid");
    let inputQuantity= document.getElementById("input-quantity");

    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let bookIDValue = inputBookID.value;
    let quantityValue = inputQuantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        bookID: bookIDValue,
        quantity: quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-booksorders-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderID.value = '';
            inputBookID.value = '';
            inputQuantity.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// BooksAuthors
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("booksorders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let bookIDCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.bookOrderID;
    bookIDCell.innerText = newRow.title;
    orderIDCell.innerText = newRow.orderID;
    quantityCell.innerText = newRow.quantity;


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(bookIDCell);
    row.appendChild(orderIDCell);
    row.appendChild(quantityCell);

    row.setAttribute('data-value', newRow.bookOrderID);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
