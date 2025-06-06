// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-orderid-update");
    let inputCustomerID = document.getElementById("input-customerid-update");
    let inputDateOrdered = document.getElementById("input-dateordered-update")
    let inputOrderType = document.getElementById("input-ordertype-update")

    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let customerIDValue = inputCustomerID.value;
    let dateOrderedValue = inputDateOrdered.value;
    let orderTypeValue = inputOrderType.value;
    
    // currently the database table for Orders does not allow updating values to NULL
    // so we must abort if being bassed NULL for OrderID

    if (isNaN(orderIDValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        customerID : customerIDValue,
        dateOrdered: dateOrderedValue,
        orderType: orderTypeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of customerID value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign customerID to our value we updated to
            td.innerHTML = parsedData[1].customerID; 
       }
    }
}
