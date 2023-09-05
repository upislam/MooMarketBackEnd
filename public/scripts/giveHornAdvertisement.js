function pictureHandler(){
    const fileInput = document.getElementById("picture");
    const fileName = fileInput.value.toLowerCase();

    if (!fileName.endsWith(".png")&&!fileName.endsWith(".jpg")&&!fileName.endsWith(".jpeg")) {
        swal({
            title: "Wrong file type!",
            text: "You have to upload a png/jpg/jpeg file!",
        });
        fileInput.value = "";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('submit').disabled = false;
    }
}

function quantityHandler(){
    const quantity = document.getElementById("quantity").value;
    if(parseInt(quantity)<=0){
        document.getElementById('quantity_error').innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('quantity_error').innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}

function sellingPricePerPieceHandler(){
    const pricePerKg = document.getElementById("selling_price_per_piece").value;
    if(parseInt(pricePerKg)<=0){
        document.getElementById('selling_price_per_piece_error').innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('selling_price_per_piece_error').innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}

function dateHandler(){
    const dateOfStorage = document.getElementById("date_of_storage").value;
    const dateOfExpiry = document.getElementById("date_of_expiry").value;
    if(new Date(dateOfStorage)>new Date(dateOfExpiry)){
        document.getElementById('date_error').innerHTML = "Date of expiry must be after date of storage";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('date_error').innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}