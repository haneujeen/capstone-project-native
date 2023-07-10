import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

export default function SubwayStationScreen({ route, navigation }) {
    const { trainArrivals, departure } = route.params;
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [train, setTrain] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (destination) {
            navigation.navigate("TrainScreen", { train: train, departure: departure, destination: destination });
        }
    }, [destination]);

    // Detailed information about arriving trains to this subway station.
    const selectTrain = (train) => {
        setTrain(train);

        // Fetch all stations on the route of the selected train
        let fetchedStations = fetchStationsOnRoute("subway", train);
        setStationsOnRoute(fetchedStations);
    }

    const selectDestination = (station) => {
        setDestination(station);
    };

    return (
        <View style={styles.container}>
            <Text>Subway Station Screen</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination?.name}</Text>
            {/* Information here */}
            <FlatList
                data={trainArrivals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectTrain(item)}>
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
