import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, Button, StyleSheet, ActivityIndicator } from "react-native";
import { getBusSocket } from '../../../api/socket_service';
import BusView from './BusView';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../../api/push_service';
import { colors } from '../../../styles/colors';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken, title, body) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: '...' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export default function SocketView({ location, navigation }) {
    const [ socket, setSocket ] = useState(null);
    const [ bus, setBus ] = useState(null);
    const { latitude, longitude } = location.coords;

    //location = {x: longitude, y: latitude}
    location = {x: 127.017167, y: 37.652699}
    
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Received notification:', notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        try {
            let socket = getBusSocket(location, setBus);
            setSocket(socket);
        } catch (error) {
            console.log(error);
        }
        return () => {
            socket.close();
        }
    }, [])

    useEffect(() => {
        if (!socket) return;
        /** 
        socket.send(JSON.stringify({
            'request': 'push',
            'token': expoPushToken
        }));
        */
    }, [expoPushToken]);

    return (
        <View style={styles.container}>
            {bus ? (
                <BusView 
                bus={bus} 
                socket={socket} 
                navigation={navigation} 
                sendPushNotification={sendPushNotification}
                expoPushToken={expoPushToken}
            />
            ) : (
                <ActivityIndicator size="large" color={colors.systemGray2} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height: '100%',
        justifyContent: 'center',
    }
});
