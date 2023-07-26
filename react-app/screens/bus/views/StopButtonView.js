import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import * as Device from 'expo-device';

import { useEffect, useState } from "react";

export default function StopButtonView({ bus, uuid, socket }) {

    let deviceName = Device.deviceName;
    const [stopBusData, setStopBusData] = useState(null);
    
    useEffect(() => {
    }, [bus]);

    const onStopButtonPress = () => {
        // Store the current bus data when stop button is pressed
        let data = {
            'deviceName': deviceName,
            'uuid': uuid,
            'busId': bus.id,
            'stationName': bus.station.name,
            'location': [bus.longitude, bus.latitude],
            'request': 'stop'
        }
        console.log("setting stopBusData: ", data)
        setStopBusData(data);

        socket.sendStopRequest(data);
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={onStopButtonPress}>
                <Text>Stop</Text>
            </TouchableOpacity>
            {stopBusData && (
                <>
                    <Text>{stopBusData.deviceName} {stopBusData.uuid}</Text>
                    <Text>location: {stopBusData.location}</Text>
                    <Text>bus Id: {stopBusData.busId} Request to stop at: {stopBusData.stationName}</Text>
                </>
            )}
            <Text>{deviceName} {uuid}</Text>
            <Text>location: {bus.longitude} {bus.latitude}</Text>
            <Text>bus Id: {bus.id} Request to stop at: {bus.station.name}</Text>
        </SafeAreaView>
    )
}