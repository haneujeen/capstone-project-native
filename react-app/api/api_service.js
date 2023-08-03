import axios from 'axios';
import { BASE_URL } from './config';

export async function fetchStationsOnRoute(carType, car) {
    let data;
    if (carType === 'bus') {
        try {
            // Fetch all stations from OGD
            let response = await axios.get(`${BASE_URL}/bus/get_stations_on_route/${car}`);
            data = {data: response.data, status: response.status};
        } catch (error) {
            console.error(error);
            data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
        }
    } else if (carType === 'subway') {
        const endpoint = `get_stations_on_route/${car.route_params.start_name}/${car.route_params.line}/${car.route_params.direction}/${car.route_params.stops_at}`;
        try {
            let response = await axios.get(`${BASE_URL}/subway/${endpoint}`);
            data = {data: response.data, status: response.status};
        } catch (error) {
            console.error(error);
            data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
        }
    }
    return data;
}