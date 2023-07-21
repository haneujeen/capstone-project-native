import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faSubway } from '@fortawesome/free-solid-svg-icons';
import { fetchBusArrivals } from '../../api/api_service';

export default function List({ route, navigation }) {
    const { busStations, busMessage, subwayStations, subwayMessage } = route.params;
    const [stationType, setStationType] = useState('subway');
    const [departure, setDeparture] = useState(null);
    const [arrivals, setArrivals] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if ((departure && arrivals) || message) {
            if (stationType === 'bus') {
                navigation.navigate("BusStation", { departure: departure, arrivals: arrivals, message: message });
            } else {
                navigation.navigate("SubwayStation", { departure: departure, arrivals: arrivals, message: message });
            }
        }
    }, [arrivals, message]);

    const handleIconPress = (type) => {
        setStationType(type);
    }

    // Note: The data structures for bus arrivals and subway arrivals are different
    const selectDeparture = async (station) => {
        let result;
        if (station.type === 'bus') {
            setDeparture(station);
            result = await fetchBusArrivals(station.ars_id);
            if (result.status === 200) {
                setArrivals(result.data.list);
            } else {
                setMessage(result.data.message);
            }
        } else {
            setDeparture(station.station);
            setArrivals(station.trains)
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
                        size={27}
                        style={{ color: stationType === 'bus' ? 'hsla(211, 86%, 50%, 1)' : 'hsla(9, 8%, 83%, 1)' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => handleIconPress('subway')}
                    activeOpacity={0.6}
                >
                    <FontAwesomeIcon
                        icon={faSubway}
                        size={27}
                        style={{ color: stationType === 'subway' ? 'hsla(211, 86%, 50%, 1)' : 'hsla(9, 8%, 83%, 1)' }}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>STATIONS</Text>
            {stationType === 'bus' && busStations && (
                <>
                    <View style={styles.listView}>
                        <FlatList
                            data={busStations}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[styles.listItem, index === busStations.length - 1 ? styles.lastListItem : null]}
                                    onPress={() => selectDeparture(item)}
                                >
                                    <View style={styles.textContainer}>
                                        <Text style={styles.listItemText}>{item.name}</Text>
                                        <Text style={styles.description}>
                                            (ID: {item.ars_id}, {item.direction} 방향)
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </>

            )}
            {stationType === 'bus' && busMessage && (
                <View style={styles.innerContainer}>
                    <Text>{busMessage}</Text>
                </View>
            )}
            {stationType === 'subway' && subwayStations && (
                <>
                    <View style={styles.listView}>
                        <FlatList
                            data={subwayStations}
                            keyExtractor={(item) => item.station.id.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => selectDeparture(item)}
                                    style={[styles.listItem, index === subwayStations.length - 1 ? styles.lastListItem : null]}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.listItemText}>{item.station.name}</Text>
                                        <Text style={styles.description}>
                                            ({item.station.direction}, {item.station.next_station.name}역 방향)
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </>

            )}
            {stationType === 'subway' && subwayMessage && (
                <View>
                    <Text>{subwayMessage}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderRadius: 10,
        height: '11%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginVertical: 33,
        alignSelf: 'center',
    },
    iconContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listView: {
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderRadius: 10,
        marginVertical: 10,
        maxHeight: '67.5%',
    },
    listItem: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 84%, 1)',
        padding: 11,
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    listItemText: {
        fontSize: 15,
        paddingEnd: 5,
    },
    description: {
        color: 'hsla(0, 0%, 53%, 1)',
        fontSize: 13,
    },
    lastListItem: {
        borderBottomWidth: 0,
    },
    subtitle: {
        color: 'hsla(0, 0%, 53%, 1)',
        paddingLeft: 10,
        paddingTop: 10,
    },
});
