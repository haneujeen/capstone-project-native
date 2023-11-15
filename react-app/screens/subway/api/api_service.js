import axios from "axios";
import { BASE_URL } from "../../../api/config";

export async function fetchFacilities(stationName) {
    try {
        let response = await axios.get(`http://${BASE_URL}/subway/get_facilities/${stationName}`);
        data = {data: response.data, status: response.status};
    } catch (error) {
        console.error(error);
        data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
    }

    return data;
}