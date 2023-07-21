export function getBusSocket(location, setBus) {
    let endpoint = `ws://172.30.1.59:8000/ws/bus/${location.x, location.y}/`;

    const socket = new WebSocket(endpoint);

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    socket.addEventListener('message', (event) => {
        console.log('Message from server: ', event.data);
        const data = JSON.parse(event.data);
        setBus(data);
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
