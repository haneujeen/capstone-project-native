import { dummyBus, dummyTrain } from "./dummies";
import { BASE_URL } from "./config";

export function getBusSocket(location, setBus) {
    let endpoint = `ws://${BASE_URL}/ws/bus/${location.x}/${location.y}/`;

    let socket = new WebSocket(endpoint);

    socket.onopen = () => {
        console.log('WebSocket is open now.');
    };

    socket.onmessage = (event) => {
        let data;
        if (event.data === null) {
            data = dummyBus();
        } else {
            data = JSON.parse(event.data);
        }
        setBus(data);
    };

    socket.onerror = (error) => {
        console.log(error);
    };

    socket.onclose = (event) => {
        console.log('WebSocket is closed now.', event.reason);
    };

    const sendStopRequest = (request) => {
        const requestData = JSON.stringify(request);
        socket.send(requestData);
    }

    socket.sendStopRequest = sendStopRequest;

    return socket;
}

export function getSubwaySocket(trainId, setTrain) {
    let socket = new WebSocket(`ws://${BASE_URL}/ws/subway/${trainId}/`);

    socket.onopen = () => {
        console.log('WebSocket is open now.');
    };

    socket.onmessage = (event) => {
        let data;
        if (event.data === null) {
            data = dummyTrain();
        } else {
            data = JSON.parse(event.data);
        }

        setTrain(data);
    };

    socket.onerror = (error) => {
        console.log(error);
    };

    socket.onclose = (event) => {
        console.log('WebSocket is closed now.', event.reason);
    };

    return socket;
}
