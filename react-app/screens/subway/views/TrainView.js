import { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity } from "react-native";
import { fetchStationsOnRoute } from '../../../api/api_service';

export default function TrainView({ train }) {
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        const fetchStations = async () => {
            let result = await fetchStationsOnRoute("subway", train);
            if (result.status === 200) {
                setStationsOnRoute(result.data.list);
            } else {
                setStationsOnRoute("");
            }
        };
        fetchStations();
    }, [train]);
    

    const selectDestination = (item) => {
        console.log(item)
        setDestination(item)
    }

    return (
        <SafeAreaView>
            <Text>{train.previous_station.name} {train.current_station.name}</Text>
            <Text>{train.current_station.name} {train.line} {train.direction} {train.stops_at}</Text>
            {stationsOnRoute && (
                <FlatList
                    data={stationsOnRoute}
                    keyExtractor={(item) => item.station_id.toString()}
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