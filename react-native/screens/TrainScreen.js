import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TrainScreen({ route }) {
    const { departure, destination } = route.params;

    return (
        <View style={styles.container}>
            <Text>Station Screen</Text>
            <Text>Type: {type}</Text>
            <Text>From: {departure.name}</Text>
            <Text>To: {destination.name}</Text>
            {/* Information here */}
            <View style={styles.innerContainer}>
                <View style={styles.stationScreen}>
                    <View style={styles.screenHeader}>
                        <Text>curren stop ... next stop ... follwing stop</Text>
                    </View>
                    <View style={styles.screenBody}>
                        <Text>{bus.station_name} {bus.next_station_name}</Text>
                    </View>
                    <View style={styles.screenFooter}>
                        <Text>{bus.line_name} {bus.plate_number} {bus.current_speed} km/h {bus.travel_time}s</Text>
                    </View>
                </View>
            </View>
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
