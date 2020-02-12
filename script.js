let y = moment().format('YYYY');
let m = moment().format('MM');
let d = moment().format('DD');
let miles = 2;
let lttude = "";
let lngtude = "";
let LatLng = "";
let trueFalse = "T"
function getselectedvalue() {
  miles = $("#distanceSelector").val();
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      var x = document.getElementById("location");
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
    }
    function showPosition(position) {
    var x = document.getElementById("location");
    if(trueFalse === "T") {
    latlon = position.coords.latitude + "," + position.coords.longitude;
    lttude = position.coords.latitude;
    lngtude = position.coords.longitude;
    trueFalse = "F";
    }
    
    $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?&radius="+miles+"&startDateTime="+y+"-"+m+"-"+d+"T00:00:00Z&sort=date,asc&apikey=tHSjnlUwSqOUd8dJ9Zg9dkfUxn0ALVqq&latlong="+latlon,
    async:true,
    dataType: "json",
    success: function(json) {
                var e = document.getElementById("events");
                // e.innerHTML = json.page.totalElements + " events found.";
                console.log(json);
                showEvents(json);
                initMap(position, json);
            },
    error: function(xhr, status, err) {
            }
    });
    
    }
    
    function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
          x.innerHTML = "User denied the request for Geolocation."
          break;
      case error.POSITION_UNAVAILABLE:
          x.innerHTML = "Location information is unavailable."
          break;
      case error.TIMEOUT:
          x.innerHTML = "The request to get user location timed out."
          break;
      case error.UNKNOWN_ERROR:
          x.innerHTML = "An unknown error occurred."
          break;
    }
    }
    
    
    function showEvents(json) {
      $("#eventList").empty();
      console.log(json._embedded.events[0].url)
    for(var i=0; i<json.page.size; i++) {
   
    $("#eventList").append("<div class='event-card'><a href=" + json._embedded.events[i].url + ">"+json._embedded.events[i].name+" "+json._embedded.events[i].dates.start.localDate+"</a></div>");
    }
    }
    
    
    function initMap(position, json) {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
    center: {lat: lttude, lng: lngtude},
    zoom: 13,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17j263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
    });
    for(var i=0; i<json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
    }
    }
    
    function addMarker(map, event) {
    var marker = new google.maps.Marker({
    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    map: map,
    title: event.name
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }
    
    getLocation();
    $("#distanceBtn").on("click", showPosition);