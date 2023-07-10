import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

export default function BusStationScreen({ route, navigation }) {
    const { busArrivals, departure } = route.params;
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [bus, setBus] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (destination) {
            navigation.navigate("BusScreen", { bus: bus, departure: departure, destination: destination });
        }
    }, [destination]);

    // Detailed information about arriving buses to this bus station.
    const selectBus = (bus) => {
        setBus(bus);

        // Fetch all stations on the route of the selected bus
        let fetchedStations = fetchStationsOnRoute("bus", bus);
        setStationsOnRoute(fetchedStations);
    }

    const selectDestination = (station) => {
        setDestination(station);
    };

    return (
        <View style={styles.container}>
            <Text>Bus Station Screen</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination?.name}</Text>
            {/* Information here */}
            <FlatList
                data={busArrivals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectBus(item)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            {stationsOnRoute && (
                <>
                    <Text>Wanna set up destination and get alert?</Text>
                    <FlatList
                        data={stationsOnRoute}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectDestination(item)}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Skip?" onPress={() => setDestination(0)} />
                </>
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
