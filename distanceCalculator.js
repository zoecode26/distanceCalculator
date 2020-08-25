let map, popup, Popup;
var markers = []
var line;

function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25, lng: 0 },
    zoom: 2,
    gestureHandling: 'cooperative',
  });

	if (window.matchMedia("(min-height: 1000px)").matches) {
		map.setCenter({lat: 0, lng: 0})
	}

  google.maps.event.addListener(map, 'click', function(event) {
  	if (markers.length == 0){
   		placeMarker(event.latLng);
   	}
   	else if (markers.length == 1){
   		placeMarker(event.latLng);
   		calcDistance()
   	}
   	else if (markers.length == 2){
   		clearMarkers();
   	}
  });

  function placeMarker(location) {

    var marker = new google.maps.Marker({
        position: location, 
        map: map
    });

    markers.push(marker)
  }

    class Popup extends google.maps.OverlayView {
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");
      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      );
      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";

      if (display === "block") {
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }
  }



  popup = new Popup(
    new google.maps.LatLng(-33.866, 151.196),
    document.getElementById("content")
  );
  popup.setMap(map);


  popup.addListener('click', function() {
    console.log("CLICKED")
  });


  function calcDistance(){

		var firstlat = markers[0].getPosition().lat();
		var firstlng = markers[0].getPosition().lng();
		var secondlat = markers[1].getPosition().lat();
		var secondlng = markers[1].getPosition().lng();

		if (firstlng < secondlng){
			rightlng = secondlng
			var lngdist = secondlng-firstlng
		}
		else{
			rightlng = firstlng
			var lngdist = firstlng-secondlng
		}

		if (firstlng < secondlng){
			var toleft = firstlng +180
			var toright = 180 - secondlng
			totdist = toleft+toright
		}
		else{
			var toleft = secondlng +180
			var toright = 180 - firstlng
			totdist = toleft+toright
		}

		console.log(lngdist)
		console.log(totdist)

		if (totdist < lngdist){
			map.setCenter({lat: 25, lng: rightlng+totdist/2}); 
		}

		var coords = []
		coords.push(markers[0].getPosition())
		coords.push(markers[1].getPosition())

		line= new google.maps.Polyline({
 		  path: coords,
  		strokeColor: '#FF0000',
  		strokeOpacity: 1.0,
  		strokeWeight: 2
		});

		line.setMap(map);

		var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
  	new google.maps.LatLng({
        lat: firstlat, 
        lng: firstlng
    }),
    new google.maps.LatLng({
        lat: secondlat, 
        lng: secondlng
    })
);


// Outputs: Distance in Meters:  286562.7470149898
	var miles = Math.round(distanceInMeters* 0.000621371)

	document.getElementById("distancelabel").innerHTML = ("Distance: "+ miles+ " miles")

  }  
}

function clearMarkers() {
	markers[0].setMap(null)
	markers[1].setMap(null)
	line.setMap(null)
	markers = [];
  if (window.matchMedia("(min-height: 1000px)").matches) {
    map.setCenter({lat: 0, lng: 0})
  }
  else{
    map.setCenter({lat: 25, lng: 0})
  }
	document.getElementById("distancelabel").innerHTML = ("Distance:")
}

function text(){
	popup.setMap(null);
}



