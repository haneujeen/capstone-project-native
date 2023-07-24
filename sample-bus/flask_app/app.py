from flask import Flask, render_template, request

app = Flask(__name__,
    template_folder='templates'
)

@app.route("/receive_stop_request", methods=["POST"])
def recieve_stop_request():
    print("From user: ")
    stop_request = request.args
    print(stop_request)
    deviceName = stop_request.get('deviceName')
    uuid = stop_request.get('uuid')
    busId = stop_request.get('busId')
    stationName = stop_request.get('stationName')
    location = stop_request.get('location')

    return {'status': 'success'}

@app.route("/receive_likely_bus", methods=["POST"])
def recieve_likely_bus():
    print("From django: ")
    bus_data = request.args
    print(bus_data)
    bus_id = bus_data.get('id')
    bus_route = bus_data.get('route')
    bus_name = bus_data.get('name')
    bus_longitude = bus_data.get('x')
    bus_latitude = bus_data.get('y')

    return {'status': 'success'}

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)