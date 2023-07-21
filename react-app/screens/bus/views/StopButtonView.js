import { SafeAreaView, Text } from "react-native";
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";

export default function StopButtonView({ bus }) {

    let deviceName = Device.deviceName;
    let uuid = uuidv4();

    useEffect(() => {
    }, [bus]);

    return (
        <SafeAreaView>
            <Text>Stop</Text>
            <Text>{deviceName} {uuid}</Text>
            <Text>location: {bus.longitude} {bus.latitude}</Text>
            <Text>bus Id: {bus.id}</Text>
        </SafeAreaView>
    )
}