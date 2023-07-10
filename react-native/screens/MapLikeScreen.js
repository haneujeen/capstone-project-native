import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

// It's map-like screen because it shows the list of stations. But it's not a map.
export default function MapLikeScreen({ route, navigation }) {
    const { stations } = route.params;
    const [departure, setDeparture] = useState(null);
    const [stationType, setStationType] = useState(null);
    const [arrivals, setArrivals] = useState(null);
    
    useEffect(() => {
        if (arrivals) {
            if (stationType === 'bus') {
                navigation.navigate("BusStation", { busArrivals: arrivals, departure: departure });
            } else {
                navigation.navigate("SubwayStation", { trainArrivals: arrivals, departure: departure })
            }
        }
    }, [arrivals]);

    const selectDeparture = (station) => {
        setDeparture(station);
        setStationType(station.type);
        
        if (stationType === 'bus') {
            const busArrivals = fetchBusArrivals(stationName); 
            setArrivals(busArrivals);
        } else {
            const trainArrivals = fetchTrainArrivals(stationName);
            setArrivals(trainArrivals);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Details Screen</Text>
            <Text>From {departure?.name} to {destination?.name}</Text>
            {!departure && (
                <FlatList
                    data={stations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectDeparture(item)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
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
