import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import getSocket from '../api/socket_service';

export default function TrainScreen({ route }) {
    const { train, destination } = route.params;
    const [socket, setSocket] = useState();
    const [myTrain, setMyTrain] = useState();

    useEffect(() => {
        const socket = getSocket(train.type, train, setMyTrain);
        setSocket(socket);

        return () => { socket.close(); };
    }, []);



    return (
        <View style={styles.container}>
            <Text>Station Screen</Text>
            <Text>To: {destination?.name}</Text>
            {/* <View style={styles.innerContainer}>
                <View style={styles.stationScreen}>
                    <View style={styles.stationScreen}>
                        <View style={styles.screenHeader}>
                            <Text>{myTrain ? myTrain.number : ''} {myTrain ? myTrain.line : ''}</Text>
                        </View>
                        <View style={styles.screenBody}>
                            <Text>{myTrain ? `${myTrain.previous_station.name} - ${myTrain.current_station.name} - ${myTrain.next_station.name}` : ''}</Text>
                        </View>
                        <View style={styles.screenFooter}>
                            <Text>{myTrain ? myTrain.current_station.name : ''}</Text>
                        </View>
                    </View>
                </View>
            </View> */}
            
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
