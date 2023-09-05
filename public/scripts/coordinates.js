var districts=[]
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
    districts = [];
    for(let i = 0; i < data.length; i++){
        districts.push(data[i].name);
    }
    districts.sort()
    const parent = document.getElementById('district');
    for(let i = 0; i < districts.length; i++){
        let opt = document.createElement('option');
        opt.value = districts[i];
        opt.innerHTML = districts[i];
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

function thanaHandler(){
    var parent = document.getElementById('thana');
    const value = parent.value;
    console.log(value);
    let thanas
    fetch('/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            thana:value
        })
    })
    .then(res => {
        if (!res.ok) {
          throw new Error('Network response status was vejal');
        }
        return res.json();
    })
    .then(data => {
        var coordinates = data;
        var ggwp = []
        console.log(coordinates);
        var minLng=1000.0;
        var maxLng=-1000.0;
        var minLat=1000.0;
        var maxLat=-1000.0;
        for(let i = 0; i < coordinates.length; i++){
            ggwp.push({lng:parseFloat(coordinates[i].lng), lat:parseFloat(coordinates[i].lat)})
            minLng = Math.min(minLng, parseFloat(coordinates[i].lng));
            maxLng = Math.max(maxLng, parseFloat(coordinates[i].lng));
            minLat = Math.min(minLat, parseFloat(coordinates[i].lat));
            maxLat = Math.max(maxLat, parseFloat(coordinates[i].lat));
        }

        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lng: (maxLng+minLng)/2.0,lat:(maxLat+minLat)/2.0 },
            zoom: 10,
        });
        console.log(ggwp);
        var polygon = new google.maps.Polygon({
            paths: ggwp,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });
        polygon.setMap(map);
    })
    .catch(err => {
        console.log(err.Error);
    });
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 21.94429398, lng: 90.02845764 },
      zoom: 16,
    });

    // var ggwp = [{ lng:90.02845764, lat:21.94429398},
    //   { lng:90.02829742, lat:21.94432449},
    //   { lng:90.02763367, lat:21.94636917},
    //   { lng:90.02780914, lat:21.94658089},
    //   { lng:90.02852631, lat:21.94725037},
    //   { lng:90.02902985, lat:21.94766045},
    //   { lng:90.02974701, lat:21.94832802},
    //   { lng:90.02989197, lat:21.94846153},
    //   { lng:90.03025055, lat:21.9485302},
    //   { lng:90.03038788, lat:21.94833183},
    //   { lng:90.03025055, lat:21.94792938}]
    // var polygon = new google.maps.Polygon({
    //   paths: ggwp,
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: "#FF0000",
    //   fillOpacity: 0.35,
    // });
    // polygon.setMap(map);
  }
  initMap();