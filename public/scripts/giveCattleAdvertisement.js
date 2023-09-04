function quantityHandler(){
    const quantity = document.getElementById("quantity").value;
    if(parseInt(quantity)<=0){
        document.getElementById('quantity_error').innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
        return;
    }
    else{
        document.getElementById('quantity_error').innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
    
    document.getElementById('parent').innerHTML = "";
    for(let i=0;i<parseInt(quantity);i++){
        document.getElementById('parent').innerHTML += `
        <h2 style="text-align:center">Cattle ${i+1}</h2>
        <div class="col-auto">
          <label for="age" class="form-label">Age</label>
          <input type="number" class="form-control" id="age${i}" name="age${i}" placeholder="Age" oninput="ageHandler(${i})"  required>
        </div>
        <label for="Quantity" class="form-label" id="age_error${i}" style="color: red;"></label>
        <div class="col-auto">
          <label for="Color" class="form-label">Color</label>
          <input type="text" class="form-control" id="color" name="color${i}" placeholder="Color" required>
        </div>
        <div class="col-auto">
          <label for="weight" class="form-label">Weight</label>
          <input type="number" class="form-control" id="weight${i}" name="weight${i}" placeholder="Weight" oninput="weightHandler(${i})"  required>
        </div>
        <label for="Quantity" class="form-label" id="weight_error${i}" style="color: red;"></label>
        <div class="col-auto">
          <label for="Type" class="form-label">Gender</label>
          <select id="gender" name="gender${i}" class="form-select" aria-label=".form-select"  required>
              <option value="male">male</option>
              <option value="female">female</option>
          </select>
      </div>
      <div class="col-auto">
        <label for="Type" class="form-label">Veterinary verified?</label>
        <select id="veterinary_verified${i}" name="veterinary_verified${i}" class="form-select" aria-label=".form-select"  required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>
      </div>
      <div class="col-auto">
      <label for="Picture" class="form-label">Picture front view</label>
      <input type="file" class="form-control" id="picture_front_view" name="picture_front_view" oninput="pictureFrontHandler(${i})" required>
    </div>
    <div class="col-auto">
      <label for="Picture" class="form-label">Picture left view</label>
      <input type="file" class="form-control" id="picture_left_view" name="picture_left_view" oninput="pictureLeftHandler(${i})" required>
    </div>
    <div class="col-auto">
      <label for="Picture" class="form-label">Picture right view</label>
      <input type="file" class="form-control" id="picture_right_view" name="picture_right_view" oninput="pictureRightHandler(${i})" required>
    </div>
    <div class="col-auto">
      <label for="Picture" class="form-label">Picture back view</label>
      <input type="file" class="form-control" id="picture_back_view" name="picture_back_view" oninput="pictureBackHandler(${i})" required>
    </div>
    <div class="col-auto">
      <label for="video" class="form-label">Video</label>
      <input type="file" class="form-control" id="video" name="video" oninput="videoHandler(${i})" required>
    </div>`;
    }
}

function priceHandler(){
  const price = document.getElementById("price").value;
    if(parseInt(price)<=0){
        document.getElementById('price_error').innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('price_error').innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}

function ageHandler(id){
  const age = document.getElementById("age"+id).value;
    if(parseInt(age)<=0){
        document.getElementById('age_error'+id).innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('age_error'+id).innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}

function weightHandler(id){
  const weight = document.getElementById("weight"+id).value;
    if(parseInt(weight)<=0){
        document.getElementById('weight_error'+id).innerHTML = "It must be a positive number";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('weight_error'+id).innerHTML = "";
        document.getElementById('submit').disabled = false;
    }
}


function pictureFrontHandler(id){
  var elements = document.querySelectorAll('#picture_front_view');
  var fileInput = elements[id];
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

function pictureLeftHandler(id){
  var elements = document.querySelectorAll('#picture_left_view');
  var fileInput = elements[id];
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

function pictureRightHandler(id){
  var elements = document.querySelectorAll('#picture_right_view');
  var fileInput = elements[id];
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

function pictureBackHandler(id){
  var elements = document.querySelectorAll('#picture_back_view');
  var fileInput = elements[id];
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

function videoHandler(id){
  var elements = document.querySelectorAll('#video');
  var fileInput = elements[id];
    const fileName = fileInput.value.toLowerCase();

    if (!fileName.endsWith(".mp4")) {
        swal({
            title: "Wrong file type!",
            text: "You have to upload a mp4 file!",
        });
        fileInput.value = "";
        document.getElementById('submit').disabled = true;
    }
    else{
        document.getElementById('submit').disabled = false;
    }
}