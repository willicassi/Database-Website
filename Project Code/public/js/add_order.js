// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customerid");
    let inputDateOrdered = document.getElementById("input-dateordered");
    let inputOrderType= document.getElementById("input-ordertype");

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let dateOrderedeValue = inputDateOrdered.value;
    let orderTypeValue = inputOrderType.value;

    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        dateOrdered: dateOrderedeValue,
        orderType: orderTypeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerID.value = '';
            inputDateOrdered.value = '';
            inputOrderType.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));


})


// Creates a single row from an Object representing a single record from 
// Orders table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let fNameCell = document.createElement("TD");
    let lNameCell = document.createElement("TD");
    let dateOrderedCell = document.createElement("TD");
    let orderTypeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.orderID;
    customerIDCell.innerText = newRow.customerID;
    fNameCell.innerText = newRow.fName;
    lNameCell.innerText = newRow.lName;
    dateOrderedCell.innerText = newRow.dateOrdered;
    orderTypeCell.innerText = newRow.orderType;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.orderID);
    };


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customerIDCell);
    row.appendChild(fNameCell);
    row.appendChild(lNameCell);
    row.appendChild(dateOrderedCell);
    row.appendChild(orderTypeCell);
    row.appendChild(deleteCell)
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.orderID);

    // Add the row to the table
    currentTable.appendChild(row);

}
