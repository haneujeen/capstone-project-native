import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export async function fetchBusStations(query) {
    let data;
    try {
        // Fetch bus stations from OGD
        let response = await axios.get(`${BASE_URL}/bus/get_bus_stations`);
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
        let response = await axios.get(`${BASE_URL}/subway/get_subway_stations`);
        data = await response.data;
        console.log(data);
    } catch (error) {
        console.error(error);
        data = `:( ${error})`
    }

    return data;
}

export async function fetchAllStations(query) {
    let data;
    try {
        // Fetch all stations from OGD
        let response = await axios.get(`${BASE_URL}/get_all_stations`);
        data = await response.data;
        console.log(data);
    } catch (error) {
        console.error(error);
        data = `:( ${error})`
    }

    return data;
}

export async function fetchStationsOnRoute(station, type) {
    let data;
    if (type == 'bus_station') {
        try {
            let response = await axios.get(`${BASE_URL}/bus/get_stations_on_route/${station.id}`);
            data = await response.data;
        } catch (error) {
            console.error(error);
            data = `:( ${error})`
        }
    } else {
        try {
            let response = await axios.get(`${BASE_URL}/subway/get_stations_on_route/${station.id}`);
            data = await response.data;
        } catch (error) {
            console.error(error);
            data = `:( ${error})`
        }
    }

    return data;
}
