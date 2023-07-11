export default function getSocket(bus, setMyBus) {
    const socket = new WebSocket(`ws://localhost:8000/ws/bus/${bus.id}/${bus.route_id}/`);

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    socket.addEventListener('message', (event) => {
        console.log('Message from server: ', event.data);
        const data = JSON.parse(event.data);
        setMyBus(data);
    });

    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
    });

    return socket;
}