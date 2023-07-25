from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

device_name, uuid, bus_id, station_name, location = '', '', '', '', []

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@app.route("/receive_stop_request", methods=["POST"])
def recieve_stop_request():
    global device_name, uuid, bus_id, station_name, location
    print("From user: ")
    stop_request = data = request.get_json()
    print(stop_request)

    device_name = stop_request.get('deviceName')
    uuid = stop_request.get('uuid')
    bus_id = stop_request.get('busId')
    station_name = stop_request.get('stationName')
    location = stop_request.get('location')

    print("Emitting stop_request_received")
    socketio.emit('stop_request_received', {'data': stop_request})
    return {'status': 'success'}

@app.route("/receive_likely_bus", methods=["POST"])
def recieve_likely_bus():
    print("From django: ")
    likely_bus = request.get_json()
    print(likely_bus)
    bus_id = likely_bus.get('id')
    bus_route = likely_bus.get('route')
    bus_name = likely_bus.get('name')
    bus_longitude = likely_bus.get('x')
    bus_latitude = likely_bus.get('y')

    print("Emitting the bus data")
    socketio.emit("likely_bus_received", {"data": likely_bus})
    return {'status': 'success'}

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001)