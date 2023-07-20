export default function getSocket(carType, car, setMyCar) {
    let endpoint = '';
    if (carType === 'bus') {
        endpoint = `ws://172.30.1.59:8000/ws/bus/${car.id}/${car.route_id}/`;
    } else if (carType === 'subway') {
        endpoint = `ws://172.30.1.59:8000/ws/subway/${car.number}/`;
    } else {
        throw new Error(`Invalid carType ${carType}`);
    }

    const socket = new WebSocket(endpoint);

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    socket.addEventListener('message', (event) => {
        console.log('Message from server: ', event.data);
        const data = JSON.parse(event.data);
        setMyCar(data);
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
    });

    const sendStopRequest = (request) => {
        const requestData = JSON.stringify(request);
        socket.send(requestData);
    }

    socket.sendStopRequest = sendStopRequest;

    return socket;
}
