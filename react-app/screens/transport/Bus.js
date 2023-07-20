import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import getSocket from '../../api/socket_service';
import { registerForPushNotificationsAsync } from '../../api/expo-notification';
import { BASE_URL } from '../../api/config';
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from 'expo-location';
import { BusMessage } from '../components/Prompts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHand, faBell } from '@fortawesome/free-solid-svg-icons';

export default function Bus({ route }) {
    const { bus, departure, destination } = route.params;
    const [socket, setSocket] = useState(null);
    const [myBus, setMyBus] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();

        const socket = getSocket(bus.car_type, bus, setMyBus);
        setSocket(socket);

        return () => { socket.close(); };
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        console.log(text)
    }

    useEffect(() => {
        const fetchSomeData = async () => {
            // Do some async operation
        };
        // This code will be executed whenever `isEnabled` changes
        if(isEnabled) {
            // If isEnabled is true, do something
            fetchSomeData();
        } else {
          // If isEnabled is false, do something else
        }
      }, [isEnabled]);  // Add isEnabled as a dependency      

    const handleRequestStop = () => {
    }

    const handleSwitchChange = (newValue) => {
        setIsEnabled(newValue);
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {myBus && (
                <>
                    {BusMessage(myBus?.station.name, myBus?.next_station.name)}
                    <View style={styles.screenContainer}>
                        <View style={styles.busScreen}>
                            <View style={styles.screenHeader}>
                                <Text>{myBus?.previous_station.name} {myBus?.station.name} {myBus?.next_station.name}</Text>
                            </View>
                            <View style={styles.screenBody}>
                                <Text>{myBus?.id} {myBus?.name} {myBus?.desc.is_last} {myBus?.desc.is_full}</Text>
                            </View>
                            <View style={styles.screenFooter}>
                                <Text>{myBus?.name} {myBus?.desc.plate_number} {myBus?.desc.speed} km/h {myBus?.desc.travel_time}s</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity 
                        style={[styles.listContainer, {borderBottomWidth: 0.5, borderBottomColor: 'hsla(0, 0%, 83%, 1)'}]}
                        onPress={handleRequestStop}
                        >
                            <View style={styles.iconContainer}>
                                <FontAwesomeIcon 
                                    icon={faHand} 
                                    size={20} 
                                    style={{color: "hsla(0, 0%, 100%, 1)"}} 
                                />
                            </View>
                            <Text style={styles.label}>Request to stop {myBus?.longitude} {myBus?.latitude}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listContainer}>
                            <View style={styles.bellIconContainer}>
                                <FontAwesomeIcon 
                                    icon={faBell} 
                                    size={20} 
                                    style={{color: "hsla(0, 0%, 100%, 1)"}} 
                                />
                            </View>
                            <Text style={styles.label}>Push notification</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', }}>
                            <Switch
                                style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                                trackColor={{ false: "hsla(9, 8%, 83%, 1)", true: "hsla(211, 100%, 55%, 1)" }}
                                thumbColor={"#fff"}
                                ios_backgroundColor="hsla(9, 8%, 83%, 1)"
                                onValueChange={handleSwitchChange}
                                value={isEnabled}
                            />
                            </View>
                            
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {!myBus && (
                <Text>No!</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 16,
    },
    screenContainer: {
        flexDirection: 'row',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderRadius: 10,
        height: '20%',
        width: '100%',
        padding: 10,
        marginVertical: 10,
        alignSelf: 'center',
    },
    innerContainer: {
        flexDirection: 'column',
        backgroundColor: 'hsla(9, 18%, 92%, 1)',
        borderWidth: 0.2,
        borderColor: 'hsla(0, 0%, 89%, 1)',
        borderRadius: 10,
        width: '100%',
        marginVertical: 10,
        alignSelf: 'center',
    },
    listContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: 8,
        alignSelf: 'center',
    },
    iconContainer: {
        backgroundColor: 'hsla(3, 100%, 59%, 1)',
        width: 30,
        borderRadius: 8,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        alignSelf: 'center',
        marginStart: 8,
    },
    bellIconContainer: {
        backgroundColor: 'hsla(130, 78%, 60%, 1)',
        width: 30,
        borderRadius: 8,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
