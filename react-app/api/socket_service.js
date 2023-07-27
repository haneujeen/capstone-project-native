import { dummyBus, dummyTrain } from "./dummies";

export function getBusSocket(location, setBus) {
    let endpoint = `ws://172.30.1.59:8000/ws/bus/${location.x}/${location.y}/`;

    let socket = new WebSocket(endpoint);

    socket.onopen = () => {
        console.log('WebSocket is open now.');
    };

    socket.onmessage = (event) => {
        console.log('Message from server: ', event.data);
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
    let socket = new WebSocket(`ws://172.30.1.59:8000/ws/subway/${trainId}/`);

    socket.onopen = () => {
        console.log('WebSocket is open now.');
    };

    socket.onmessage = (event) => {
        console.log('Message from server: ', event.data);

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
        //setTimeout(() => getSubwaySocket(trainId, setTrain), 5000);
    };

    return socket;
}
