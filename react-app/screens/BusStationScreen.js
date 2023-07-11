import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

export default function BusStationScreen({ route, navigation }) {
    const { busArrivals, departure, message } = route.params;
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [bus, setBus] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (destination) {
            navigation.navigate("Bus", { bus: bus, departure: departure, destination: destination });
        }
    }, [destination]);

    // Detailed information about arriving buses to this bus station.
    const selectBus = async (bus) => {
        setBus(bus);

        let result = await fetchStationsOnRoute("bus", bus.route_id);

        let message;
        if (result.response_code === '0') {
            setStationsOnRoute(result.list);
        } else {
            // message = result.message;
        }
    }

    const selectDestination = (station) => {
        setDestination(station);
    };

    return (
        <View style={styles.container}>
            <Text>Bus Station Screen</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination?.name}</Text>
            <Text>{busArrivals[0].id}</Text>
            {/* Information here */}
            {busArrivals && (
                <FlatList
                    data={busArrivals}
                    keyExtractor={(item) => item.route_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectBus(item)}>
                            <Text>{item.name} {item.route_id}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            {message && (
                <Text>{message}</Text>
            )}
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
