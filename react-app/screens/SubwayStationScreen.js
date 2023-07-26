import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { fetchStationsOnRoute } from '../api/api_service';

export default function SubwayStationScreen({ route, navigation }) {
    const { departure, arrivals, message } = route.params;
    const [train, setTrain] = useState(null);
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [destination, setDestination] = useState(null);
    const [localMessage, setLocalMessage] = useState(null);

    useEffect(() => {
        if (train && destination) {
            navigation.navigate("Train", { train: train, destination: destination });
        }
    }, [train, destination]);

    const selectTrain = async (train) => {
        console.log("못해먹겠다", train.number)
        const endpoint = `get_train/${train.number}`;
        try {
            let response = await axios.get(`http://localhost:8000/subway/${endpoint}`);
            let data = {data: response.data, status: response.status};
            console.log(data.data)
            setTrain(data.data.train);
        } catch (error) {
            console.error(error);
            let data = {data: `😟 ${error})`, status: error.response ? error.response.status : 500};
            setTrain(data.data.message);
        }

        let result = await fetchStationsOnRoute("subway", train);

        if (result.status === 200) {
            console.log(result.data.list)
            setStationsOnRoute(result.data.list);
        } else {
            setLocalMessage(result.message);
            setDestination({ name: 'No destination selected' })
        }
    }

    return (
        <View style={styles.container}>
            <Text>Subway Station Screen</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination?.name}</Text>
            {arrivals && (
                <FlatList
                    data={arrivals}
                    keyExtractor={(item) => item.number.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectTrain(item)}>
                            <Text>train {item.number} {item.route_params.stops_at} {item.screen_message_items.message_item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            {message && (
                <Text>{message}</Text>
            )}
            {stationsOnRoute && (
                <>
                    <Text>Select destination and get alert</Text>
                    <FlatList
                        data={stationsOnRoute}
                        keyExtractor={(item) => item.station_id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setDestination(item)}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Skip" onPress={() => setDestination({ name: 'No destination selected' })} />
                </>
            )}
            {localMessage && (
                <Text>{localMessage}</Text>
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
