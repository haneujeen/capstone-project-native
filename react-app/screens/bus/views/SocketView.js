import { useState, useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";
import { getBusSocket } from '../../../api/socket_service';
import BusView from './BusView';
import StopButtonView from './StopButtonView';
import { v4 as uuidv4 } from 'uuid';
import PushNotificationView from './PushNotificationView';

export default function SocketView({ location }) {
    const [ socket, setSocket ] = useState(null);
    const [ bus, setBus ] = useState(null);
    const { latitude, longitude } = location.coords;

    //location = {x: longitude, y: latitude}
    location = {x: 127.0741781792, y: 37.6227408373}
    let uuid = uuidv4();

    useEffect(() => {
        try {
            let socket = getBusSocket(location, setBus);
            setSocket(socket);
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <SafeAreaView>
            <Text>{location.x} {location.y}</Text>
            {bus && (
                <>
                    <Text>{bus.id} {bus.name}</Text>
                    <BusView bus={bus}></BusView>
                    <StopButtonView bus={bus} uuid={uuid} socket={socket}></StopButtonView>
                    <PushNotificationView></PushNotificationView>
                </>
            )}
        </SafeAreaView>
    )
}
