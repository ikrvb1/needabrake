import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

console.log("Mapbox GL JS Loaded:", mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoiaWtydmIxIiwiYSI6ImNtN2w3dWpzZTA5MHcybnByZTl6NnZrOTIifQ.236I69H5F1YHv7EOUU-lug';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ikrvb1/cm7l9b1u6004o01ra50qa56jt',
    center: [-71.09415, 42.36027],
    zoom: 12, 
    minZoom: 5,
    maxZoom: 18
});

map.on('load', async () => {
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
    });

    map.addLayer({
        id: 'bike-lanes',
        type: 'line',
        source: 'boston_route',
        paint: {
            'line-color': '#CC5500',
            'line-width': 2.5,
            'line-opacity': 0.6
        }
    });

    map.addSource('cambridge_route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
    });

    map.addLayer({
        id: 'cambridge-bike-lanes',
        type: 'line',
        source: 'cambridge_route',
        paint: {
            'line-color': '#CC5500',
            'line-width': 2.5,
            'line-opacity': 0.6
        }
    });

    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    const jsonData = await d3.json(jsonurl);
    let stations = jsonData.data.stations;
    console.log('Stations Array:', stations);

    const svg = d3.select('#map').select('svg');

    function getCoords(station) {
        const point = new mapboxgl.LngLat(+station.lon, +station.lat);
        const { x, y } = map.project(point);
        return { cx: x, cy: y };
    }

    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);

    const trips = await d3.csv('https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv');
    console.log('Traffic Data:', trips);

    const departures = d3.rollup(
        trips,
        v => v.length,
        d => d.start_station_id
    );

    console.log('Departures:', departures);

    const arrivals = d3.rollup(
        trips,
        v => v.length,
        d => d.end_station_id
    );

    console.log('Arrivals:', arrivals);

    stations = stations.map((station) => {
        let id = station.short_name;
        station.arrivals = arrivals.get(id) ?? 0;
        station.departures = departures.get(id) ?? 0;
        station.totalTraffic = station.arrivals + station.departures;
        return station;
    });

    console.log('Updated Stations:', stations);

    const circles = svg.selectAll('circle')
    .data(stations)
    .enter()
    .append('circle')
    .attr('r', 5)
    .each(function(d) {
        d3.select(this)
            .append('title')
            .text(() => `${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
    });

    function updatePositions() {
        circles
            .attr('cx', d => getCoords(d).cx)
            .attr('cy', d => getCoords(d).cy);
    }

    updatePositions();

    const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(stations, (d) => d.totalTraffic)])
        .range([0, 25]);

    circles.attr('r', d => radiusScale(d.totalTraffic));

});
