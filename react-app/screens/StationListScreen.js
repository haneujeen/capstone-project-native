import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faSubway } from '@fortawesome/free-solid-svg-icons';
import { fetchBusArrivals, fetchStationsOnRoute } from '../api/api_service';

export default function StationListScreen({ route, navigation }) {
    const { busStations, busMessage, subwayStations, subwayMessage } = route.params;
    const [stationType, setStationType] = useState('subway');
    const [departure, setDeparture] = useState(null);
    const [arrivals, setArrivals] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (arrivals) {
            if (stationType === 'bus') {
                navigation.navigate("BusStation", { busArrivals: arrivals, departure: departure, message: message });
            } else {
                navigation.navigate("SubwayStation", { trainArrivals: arrivals, departure: departure, message: message })
            }
        }
    }, [arrivals]);

    const handleIconPress = (type) => {
        setStationType(type);
    }

    const selectDeparture = async (station) => {
        setDeparture(station);
        setStationType(station.type);

        let result;
        if (station.type === 'bus') {
            result = await fetchBusArrivals(station.ars_id);
            if (result.response_code === '0') {
                setArrivals(result.list);
            } else {
                setMessage(result.message);
            }

        } else {
            // const trainArrivals = await fetchTrainArrivals(station.id);
            // setArrivals(trainArrivals);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => handleIconPress('bus')}
                    activeOpacity={0.6}
                >
                    <FontAwesomeIcon
                        icon={faShuttleVan}
                        size={30}
                        style={{ color: stationType === 'bus' ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 80%, 1)' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => handleIconPress('subway')}
                    activeOpacity={0.6}
                >
                    <FontAwesomeIcon
                        icon={faSubway}
                        size={30}
                        style={{ color: stationType === 'subway' ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 80%, 1)' }}
                    />
                </TouchableOpacity>
            </View>
            {stationType === 'bus' && busStations && (
                <View>
                    <FlatList
                        data={busStations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectDeparture(item)}>
                                <Text>{item.id} {item.name} {item.ars_id}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            {stationType === 'bus' && busMessage && (
                <Text>{busMessage}</Text>
            )}
            {stationType === 'subway' && busStations && (
                <View>
                    <FlatList
                        data={subwayStations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectDeparture(item)}>
                                <Text>{item.id} {item.name} {item.line}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            {stationType === 'subway' && subwayMessage && (
                <Text>{subwayMessage}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'hsla(240, 11%, 96%, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderWidth: 1,
        borderColor: 'hsla(0, 0%, 84%, 1)',
        borderRadius: 10,
        width: '80%',
        height: '23%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    iconContainer: {
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderWidth: 1,
        borderColor: 'hsla(0, 0%, 84%, 1)',
        borderRadius: 10,
        width: '45%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
    },
});
