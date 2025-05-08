// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateBooksOrdersForm = document.getElementById('update-bookorder-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputbooksOrdersID = document.getElementById("input-bookOrderID-update");
    let inputbookID = document.getElementById("input-bookID-update");
    let inputquantity = document.getElementById("input-quantity");

    // Get the values from the form fields
    let booksOrdersIDValue = inputbooksOrdersID.value;
    let bookIDValue = inputbookID.value;
    let quantityValue = inputquantity.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(inputbooksOrdersID)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        bookOrderID: booksOrdersIDValue,
        bookID: bookIDValue,
        quantity: quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-booksorders-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, booksOrdersIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, bookOrderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("booksorders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookOrderID) {

            // Get the location of the row where we found the matching bookOrderID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of bookID value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign bookID to our value we updated to
            td.innerHTML = parsedData[0].bookOrderID;
            

       }
    }
}
