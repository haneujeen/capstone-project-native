import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export async function fetchBusStations(query) {
    let data;
    try {
        // Fetch bus stations from OGD
        let response = await axios.get(`${BASE_URL}/bus/get_stations/${query}`);
        data = await response.data;
        console.log(data);
    } catch (error) {
        console.error(error);
        data = `:( ${error})`
    }

    return data;
}

export async function fetchSubwayStations(query) {
    let data;
    try {
        // Fetch subway stations from OGD
        let response = await axios.get(`${BASE_URL}/subway/get_stations/${query}`);
        data = await response.data;
        console.log(data);
    } catch (error) {
        console.error(error);
        data = `:( ${error})`
    }

    return data;
}

// Fetch the arrivals of bus/trains with station id
export async function fetchBusArrivals(station_id) {
    let data;
    try {
        // Fetch all stations from OGD
        let response = await axios.get(`${BASE_URL}/bus/get_arrivals/${station_id}`);
        data = await response.data;
        console.log(data);
    } catch (error) {
        console.error(error);
        data = `:( ${error})`
    }

    return data;
}

// Fetch all stations a bus or a train stops at
export async function fetchStationsOnRoute(carType, route_id) {
    let data;
    if (carType === 'bus') {
        try {
            // Fetch all stations from OGD
            let response = await axios.get(`${BASE_URL}/bus/get_stations_on_route/${route_id}`);
            data = await response.data;
            console.log(data);
        } catch (error) {
            console.error(error);
            data = `:( ${error})`
        }
    }
    return data;
}
