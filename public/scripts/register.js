var districts
fetch('/register/districts', {
    method: 'GET'
})
.then(res => {
    if (!res.ok) {
      throw new Error('Network response status was vejal');
    }
    return res.json();
})
.then(data => {
    districts = data;
    const parent = document.getElementById('district');
    for(let i = 0; i < districts.length; i++){
        let opt = document.createElement('option');
        opt.value = districts[i].name;
        opt.innerHTML = districts[i].name;
        parent.appendChild(opt);
    }
})
.catch(err => {
    console.log(err.Error);
});



function districtHandler(){
    var parent = document.getElementById('district');
    const value = parent.value;
    console.log(value);
    let thanas
    fetch('/register/thanas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            district:value
        })
    })
    .then(res => {
        if (!res.ok) {
          throw new Error('Network response status was vejal');
        }
        return res.json();
    })
    .then(data => {
        thanas = data;
        parent = document.getElementById('thana');
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        for(let i = 0; i < thanas.length; i++){
            let opt = document.createElement('option');
            opt.value = thanas[i].name;
            opt.innerHTML = thanas[i].name;
            parent.appendChild(opt);
        }
    })
    .catch(err => {
        console.log(err.Error);
    });
}

function passwordHandler(){
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if(password.value.length < 8){
        document.getElementById('submit').disabled = true;
        document.getElementById('prompt').innerHTML = "Password must be at least 8 characters long";
        return;
    }
    else{
        document.getElementById('prompt').innerHTML =""
    }
    if(password.value != confirmPassword.value){
        document.getElementById('submit').disabled = true;
        document.getElementById('prompt').innerHTML = "Password doesn't match";
    }
    else{
        document.getElementById('submit').disabled = false;
        document.getElementById('prompt').innerHTML = "";
    }
}