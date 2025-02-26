import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

console.log("Mapbox GL JS Loaded:", mapboxgl);

 // Set your Mapbox access token here
 mapboxgl.accessToken = 'pk.eyJ1IjoiaWtydmIxIiwiYSI6ImNtN2w3dWpzZTA5MHcybnByZTl6NnZrOTIifQ.236I69H5F1YHv7EOUU-lug';

 // Initialize the map
 const map = new mapboxgl.Map({
   container: 'map', // ID of the div where the map will render
   style: 'mapbox://styles/ikrvb1/cm7l9b1u6004o01ra50qa56jt', // Map style
   center: [-71.09415, 42.36027], // [longitude, latitude]
   zoom: 12, // Initial zoom level
   minZoom: 5, // Minimum allowed zoom
   maxZoom: 18 // Maximum allowed zoom
 });