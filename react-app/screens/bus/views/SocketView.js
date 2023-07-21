import { useState, useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";
import { getBusSocket } from '../../../api/socket_service';
import BusView from './BusView';
import StopButtonView from './StopButtonView';

export default function SocketView({ location }) {
    const [ socket, setSocket ] = useState(null);
    const [ bus, setBus ] = useState(null);
    const { latitude, longitude } = location.coords;

    let myLocation = {x: longitude, y: latitude}

    useEffect(() => {
        //try {
            //let socket = getBusSocket(myLocation, setBus);
            //setSocket(socket);
        //} catch (error) {
            //console.log(error);
        //}
        let data = JSON.parse(`{
            "id": "id",
            "name": "this_station.get('rtNm')",
            "longitude": "location['tmX']",
            "latitude": "location['tmY']",
            "previous_station": {
                "id": "previous_station.get('stId')",
                "name": "previous_station.get('stNm')"
            },
            "station": {
                "id": "this_station.get('stId')",
                "name": "this_station.get('stNm')"
            },
            "next_station": {
                "id": "next_station.get('stId')",
                "name": "next_station.get('stNm')"
            },
            "desc": {
                "bus_type": "this_station.get('busType1')",
                "travel_time": "this_station.get('traTime1')",
                "speed": "this_station.get('traSpd1')",
                "plate_number": "this_station.get('plainNo1')"
            }
        }`)

        setBus(data)
    }, [])

    return (
        <SafeAreaView>
            <Text>{myLocation.x} {myLocation.y}</Text>
            {bus && (
                <>
                    <Text>{bus.id} {bus.name}</Text>
                    <BusView bus={bus}></BusView>
                    <StopButtonView bus={bus}></StopButtonView>
                </>
            )}
        </SafeAreaView>
    )
}
