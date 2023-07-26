import axios from 'axios';
import { BASE_URL } from './config';

export async function fetchBusStations(query) {
    let data;
    try {
        let response = await axios.get(`http://${BASE_URL}/bus/get_stations/${query}`);
        data = {data: response.data, status: response.status};
    } catch (error) {
        console.error(error);
        throw error;
    }

    return data;
}

export async function fetchBusArrivals(station_id) {
    let data;
    try {
        let response = await axios.get(`http://${BASE_URL}/bus/get_arrivals/${station_id}`);
        data = {data: response.data, status: response.status};
    } catch (error) {
        console.error(error);
        throw error;
    }

    return data;
}

export async function fetchSubwayStations(query) {
    let data;
    
    try {
        let response = await axios.get(`http://${BASE_URL}/subway/get_stations/${query}`);
        data = {data: response.data, status: response.status};
    } catch (error) {
        if (error.response) {
            console.error(`Error: ${error.response.data.message}`);
            return { error: error.response.data.message, status: error.response.status };
        } else if (error.request) {
            console.error(error.request);
        } else {
            console.error('Error', error.message);
        }
    }

    return data;
}

export async function fetchStationsOnRoute(carType, car) {
    let data;
    if (carType === 'bus') {
        try {
            // Fetch all stations from OGD
            let response = await axios.get(`http://${BASE_URL}/bus/get_stations_on_route/${car.route_id}`);
            data = {data: response.data, status: response.status};
        } catch (error) {
            console.error(error);
            data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
        }
    } else if (carType === 'subway') {//{train.current_station.name} {train.line} {train.direction} {train.stops_at}
        const endpoint = `get_stations_on_route/${car.current_station.name}/${car.line}/${car.direction}/${car.stops_at}`;
        try {
            let response = await axios.get(`http://${BASE_URL}/subway/${endpoint}`);
            data = {data: response.data, status: response.status};
        } catch (error) {
            console.error(error);
            data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
        }
    }
    return data;
}
