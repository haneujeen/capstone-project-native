import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, ActivityIndicator, StyleSheet } from 'react-native'; 
import * as Location from 'expo-location';
import SocketView from './SocketView';
import { colors } from '../../../styles/colors';

export default function LocationView({ navigation }) {
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

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    } else if (location) {
        return (
            <SocketView location={location} navigation={navigation} />
        );
    } else {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.systemGray2} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height: '100%',
        justifyContent: 'center',
    }
});
