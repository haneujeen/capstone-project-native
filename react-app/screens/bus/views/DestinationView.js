import { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity } from "react-native";
import { fetchStationsOnRoute } from '../../../api/api_service';

export default function DestinationView({ id }) {
    const [stations, setStations] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        setStations(fetchStationsOnRoute('bus', id));
    }, [id]);

    const selectDestination = (item) => {
        console.log(item)
        setDestination(item)
    }

    return (
        <SafeAreaView>
            <Text>{id}</Text>
            {stations && (
                <FlatList
                    data={stations}
                    keyExtractor={(item) => item.station.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectDestination(item)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            {destination && (
                <Text>{destination.name}</Text>
            )}
        </SafeAreaView>
    )
}
