import { BASE_URL } from './config';

export function getBusSocket(location, setBus) {
    let endpoint = `ws://${BASE_URL}/ws/bus/${location.x}/${location.y}/`;

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

export function getTrainSocket(id, setTrain) {
    let endpoint = `ws://${BASE_URL}/ws/subway/${id}/`;

    const socket = new WebSocket(endpoint);

    socket.onopen = () => {
        console.log('WebSocket is open now.');
    };

    socket.onmessage = (event) => {
        console.log('Message from server: ', event.data);
        let data;
        if (event.data === 'null') {
            data = JSON.parse(`{
                "number": 7038,
                "line": "1007",
                "direction": "상행",
                "current_station": {
                    "name": "공릉(서울산업대입구)",
                    "id": "1007000716"
                },
                "previous_station": {
                    "id": "1007000717",
                    "name": "태릉입구"
                },
                "next_station": {
                    "id": "1007000715",
                    "name": "하계"
                },
                "is_arrived": "99",
                "stops_at": "장암",
                "type": "subway"
            }`);
        } else {
            data = JSON.parse(event.data);
        }
        
        setTrain(data);
        console.log(data)
    };

    socket.onerror = (error) => {
        console.log(error);
        

        setTrain(data);
    };

    socket.onclose = (event) => {
        console.log('WebSocket is closed now.', event.reason);
    };

    return socket;
}
