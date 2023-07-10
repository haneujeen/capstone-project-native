import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BusStationScreen({ route }) {
    const { departure, destination } = route.params;

    // Detailed information about the departure station
    // based on the type of station (bus or subway).

    return (
        <View style={styles.container}>
            <Text>Station Screen</Text>
            <Text>Type: {type}</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination.name}</Text>
            {/* Information here */}
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
