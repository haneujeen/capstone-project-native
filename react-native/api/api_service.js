const BASE_URL = 'http://localhost:8000';

export async function fetchData() {
    try {
        let response = await fetch(`${BASE_URL}/api/some-endpoint`);
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}