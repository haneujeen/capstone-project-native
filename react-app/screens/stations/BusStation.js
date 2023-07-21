import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, ScrollView } from 'react-native';
import { fetchStationsOnRoute } from '../../api/api_service';
import BusIcon from '../components/BusIcon'

export default function BusStation({ route, navigation }) {
    const { arrivals, departure, message } = route.params;
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [localMessage, setLocalMessage] = useState(null);
    const [bus, setBus] = useState(null);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (bus && destination) {
            navigation.navigate("Bus", { bus: bus, departure: departure, destination: destination });
        }
    }, [bus, destination]);

    // Detailed information about arriving buses to this bus station.
    const selectBus = async (bus) => {
        setBus(bus);
        console.log("fetching stations on route...")
        let result = await fetchStationsOnRoute("bus", bus);
        console.log("stations fetched...", result.status)
        if (result.status === 200) {
            console.log("setting stations on route...")
            setStationsOnRoute(result.data.list);
        } else {
            setLocalMessage(result.message);
            setDestination({ name: 'Infinite bus round' })
        }
    }

    return (
        <ScrollView nestedScrollEnabled={true}>
            <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.description}>
                    The upcoming bus information is the same as  you see on the display at a bus stop. 
                    You'll see all stations on the bus's route once you select your ride. The alert 
                    will notify you when you are nearing your destination.
                </Text>
            </View>
            <View style={styles.stationScreen}>
                <View style={styles.screenBody}>
                    {arrivals && (
                        <FlatList
                            data={arrivals}
                            keyExtractor={(item) => item.route_id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => selectBus(item)}
                                    style={styles.listItem}
                                >
                                    <Text style={styles.listItemText}>{item.name} {item.screen_message}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    {message && (
                        <Text>{message}</Text>
                    )}
                </View>
            </View>
            <Text style={styles.title}>Set up a destination</Text>
            <View style={styles.bottomContainer}>
                {!stationsOnRoute && !localMessage && (
                    <BusIcon></BusIcon>
                )}
                
                {stationsOnRoute && (
                    <View style={styles.bottomInnerContainer}>
                        <FlatList
                            data={stationsOnRoute}
                            keyExtractor={(item) => item.number.toString()}
                            renderItem={({ item }) => {
                                const isDepartureStation = item.name === departure.name && item.number === departure.ars_id;
                                return (
                                    <TouchableOpacity 
                                        onPress={() => !isDepartureStation && setDestination(item)}
                                        style={styles.listItem}
                                        disabled={isDepartureStation}
                                    >
                                        <Text style={ isDepartureStation ? styles.listItemDisabled : null }>
                                            {item.name} ({item.number}) {isDepartureStation && '📍'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <View style={{ margin: 8 }}>
                            <Button 
                                title="Skip" 
                                onPress={() => setDestination({ name: 'Infinite bus round' })} 
                            />
                        </View>
                    </View>
                )}
                {localMessage && (
                    <Text>{localMessage}</Text>
                )}
            </View>
        </View>
        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
    },
    textContainer: {
        width: '100%',
    },
    description: {
        color: 'hsla(0, 0%, 53%, 1)',
        fontSize: 13,
        marginHorizontal: 10,
    },
    stationScreen: {
        flexDirection: 'column',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderRadius: 10,
        width: '100%',
        height: 255,
        padding: 10,
        marginVertical: 15,
    },
    screenBody: {
        maxHeight: '97%'
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 84%, 1)',
        padding: 10,
    },
    listItemDisabled: {
        color: 'hsla(0, 0%, 53%, 1)',
    },
    listItemText: {
        fontSize: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 10,
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderRadius: 10,
        width: '100%',
        minHeight: 200,
        maxHeight: 640,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 25,
        alignSelf: 'center',
    },
    bottomInnerContainer: {
        width: '100%',
        height: '100%'
    },
});
