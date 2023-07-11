import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { fetchBusArrivals, fetchStationsOnRoute } from '../api/api_service';

// It's map-like screen because it shows the list of stations. But it's not a map.
export default function StationListScreen({ route, navigation }) {
    const { stations, message } = route.params;
    const [departure, setDeparture] = useState(null);
    const [stationType, setStationType] = useState(null);
    const [arrivals, setArrivals] = useState(null);
    
    useEffect(() => {
        if (arrivals) {
            if (stationType === 'bus') {
                navigation.navigate("BusStation", { busArrivals: arrivals, departure: departure, message: message });
            } else {
                navigation.navigate("SubwayStation", { trainArrivals: arrivals, departure: departure, message: message })
            }
        }
    }, [arrivals]);

    const selectDeparture = async (station) => {
        setDeparture(station);
        setStationType(station.type);
        
        let result, message;
        if (station.type === 'bus') {
            result = await fetchBusArrivals(station.ars_id);
            if (result.response_code === '0') { // data.list[0].id
                setArrivals(result.list);
            } else {
                message = result.message;
            }

        } else {
            //const trainArrivals = fetchTrainArrivals(station.id);
            //setArrivals(trainArrivals);
        }
    };

    return (
        <View style={styles.container}>
            <Text>From {departure?.name}</Text>
            {stations && (
                <FlatList
                    data={stations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectDeparture(item)}>
                            <Text>{item.id} {item.name} {item.ars_id}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            {message && (
                <Text>Wrong response: {message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
