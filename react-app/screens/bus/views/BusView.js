import { useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";

export default function BusView({ bus }) {
    useEffect(() => {
    }, [bus]);

    return (
        <SafeAreaView>
            <Text>{bus.previous_station.name}</Text>
            <Text>{bus.station.name}</Text>
            <Text>{bus.longitude} {bus.latitude}</Text>
        </SafeAreaView>
    )
}
