function init(){var e={zoom:9,center:new google.maps.LatLng(28.538335,-81.379236),styles:[{featureType:"water",elementType:"all",stylers:[{hue:"#76aee3"},{saturation:38},{lightness:-11},{visibility:"on"}]},{featureType:"road.highway",elementType:"all",stylers:[{hue:"#8dc749"},{saturation:-47},{lightness:-17},{visibility:"on"}]},{featureType:"poi.park",elementType:"all",stylers:[{hue:"#c6e3a4"},{saturation:17},{lightness:-2},{visibility:"on"}]},{featureType:"road.arterial",elementType:"all",stylers:[{hue:"#cccccc"},{saturation:-100},{lightness:13},{visibility:"on"}]},{featureType:"administrative.land_parcel",elementType:"all",stylers:[{hue:"#5f5855"},{saturation:6},{lightness:-31},{visibility:"on"}]},{featureType:"road.local",elementType:"all",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"simplified"}]},{featureType:"water",elementType:"all",stylers:[]}]},t=document.getElementById("map"),a=new google.maps.Map(t,e);new google.maps.Marker({position:new google.maps.LatLng(28.538335,-81.379236),map:a,icon:"http://unicoderbd.com/theme/html/uniland/img/marker_blue.png",title:"Snazzy!"})}google.maps.event.addDomListener(window,"load",init);