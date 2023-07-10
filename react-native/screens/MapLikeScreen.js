import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

// It's map-like screen because it shows the list of stations. But it's not a map.
export default function MapLikeScreen({ route, navigation }) {
    const { stations } = route.params;
    const [departure, setDeparture] = useState(null);
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [destination, setDestination] = useState(null);
    const [stationType, setStationType] = useState(null);

    useEffect(() => {
        if (departureStation) {
            // Fetch stations user can go from selected departure station
            const fetchedStations = fetchStationsOnRoute(departureStation, stationType);
            setStationsOnRoute(fetchedStations);
        }
    }, [departureStation]);

    const selectDeparture = (station) => {
        setDeparture(station);
        setStationType(station.type);
    };

    const selectDestination = (station) => {
        setDestination(station);
        navigation.navigate('StationScreen', { type: stationType, departure: departure, destination: station });
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
            {departure && stationsOnRoute && (
                <FlatList
                    data={stationsOnRoute}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectDestination(item)}>
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
