import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as Location from 'expo-location';
import SocketView from './SocketView';

export default function LocationView() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        console.log(text)
    }

    return (
        <SafeAreaView>
            <Text>{text}</Text>
            {location && <SocketView location={location} />}
        </SafeAreaView>
    );
}