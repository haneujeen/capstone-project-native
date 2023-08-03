import { useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";
import DestinationView from './DestinationView';

export default function BusView({ bus }) {
    useEffect(() => {
    }, [bus]);

    return (
        <SafeAreaView>
            <Text>{bus.previous_station.name}</Text>
            <Text>{bus.station.name}</Text>
            <Text>{bus.longitude} {bus.latitude}</Text>
            <Text>Update: {bus.desc.speed}</Text>
            <DestinationView id={bus.id}></DestinationView>
        </SafeAreaView>
    )
}
