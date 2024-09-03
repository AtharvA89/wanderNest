mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker=new mapboxgl.mapboxgl.Marker()
  .setLngLat([12.554728,55.706517])
  .addTo(map);  