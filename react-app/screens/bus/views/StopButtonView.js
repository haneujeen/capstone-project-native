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
        setStopBusData({...bus, deviceName, uuid});
        socket.sendStopRequest(stopBusData)
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={onStopButtonPress}>
                <Text>Stop</Text>
            </TouchableOpacity>
            {stopBusData && (
                <>
                    <Text>{stopBusData.deviceName} {stopBusData.uuid}</Text>
                    <Text>location: {stopBusData.longitude} {stopBusData.latitude}</Text>
                    <Text>bus Id: {stopBusData.id} Request to stop at: {stopBusData.station.name}</Text>
                </>
            )}
            <Text>{deviceName} {uuid}</Text>
            <Text>location: {bus.longitude} {bus.latitude}</Text>
            <Text>bus Id: {bus.id} Request to stop at: {bus.station.name}</Text>
        </SafeAreaView>
    )
}