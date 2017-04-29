var map;
// create a blank array for all the listing markers
var markers = ko.observableArray([]);

function initMap() {
        // below code is copied from google documentation with modification
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 22.5320809802915, lng: 114.0612999802915},
          scrollwheel: false,
          zoom: 14
        });

        var bounds = new google.maps.LatLngBounds();
}

// this object is used to store the data
var Model = {
  locations : [
  {title: "Shenzhen College of International Education", location: {lat: 22.518275, lng: 114.062283}},
  {title: "My home!!!", location: {lat: 22.525133, lng: 114.069884}},
  {title: "Convention&Exhibition Center", location: {lat: 22.5320809802915, lng: 114.0612999802915}},
  {title: "Coco Park", location: {lat: 22.534206, lng: 114.053701}},
  {title: "Shuiwei", location: {lat: 22.521724, lng: 114.062854}},
  {title: "Futian CheckPoint", location: {lat: 22.516043, lng: 114.070379}},
  ],

};

//create a location constructor

var Location = function(data){
  var self = this;
  this.title = data.title;
  this.location = data.location;
  this.infoWindow = new google.maps.InfoWindow({
    content: "<h2>" + data.title + "</h2>" + '<a class="twitter-share-button"  href="https://twitter.com/share" data-size="large"'+' data-text='+"'"+data.title+"'"+'>Tweet</a>'
  });

  this.marker = new google.maps.Marker({
    map: map,
    position: this.location,
    title: this.title
  });

  this.marker.addListener("click", function(){
    // request for twitter widget js
    $.getScript("http://platform.twitter.com/widgets.js");
    // close info window before opening new one
    markers().forEach(function(item){
      item.infoWindow.close();
    });
    // start animation
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    // open info window
    self.infoWindow.open(map, this);
    // end animation
    setTimeout(function() {
      self.marker.setAnimation(null)
    }, 1400);
  });
  // trigger click event on marker when list is clicked
  this.showInfoWindow = function(place){
    google.maps.event.trigger(self.marker, "click");
  }
};

var ViewModel = function(){
  var self = this;
  this.locations = ko.observableArray([]);
  // put the cat item into the observable arrray
  Model.locations.forEach(function(item){
    var place = new Location(item);
    markers.push(place);
    self.locations.push(place);
  });

  // implement the search function
  this.Query = ko.observable("");

  this.searchResults = ko.computed(function(){
    var q = self.Query();
    // clear all the marker if there is text input
    if(q != ""){
      markers().forEach(function(item){
        item.marker.setMap(null);
      });
    }
    // reuturn the marker which match the filter input
    return self.locations().filter(function(i){
      return i.title.toLowerCase().indexOf(q) >=0;
    });
  });

  this.update = function(){
    self.searchResults().forEach(function(item){
      item.marker.setMap(map);
    })
  }

 };

function startApp(){
  initMap();
  ko.applyBindings(new ViewModel());
}
