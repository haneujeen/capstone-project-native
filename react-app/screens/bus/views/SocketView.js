import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, Button } from "react-native";
import { getBusSocket } from '../../../api/socket_service';
import BusView from './BusView';
import StopButtonView from './StopButtonView';
import { v4 as uuidv4 } from 'uuid';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../../api/push_service';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
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

export default function SocketView({ location }) {
    const [ socket, setSocket ] = useState(null);
    const [ bus, setBus ] = useState(null);
    const { latitude, longitude } = location.coords;

    //location = {x: longitude, y: latitude}
    location = {x: 127.0741781792, y: 37.6227408373}
    let uuid = uuidv4();

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
    }, [])

    useEffect(() => {
        if (!socket) return;
        console.log("Sending push token with request")
        socket.send(JSON.stringify({
            'request': 'push',
            'token': expoPushToken
        }));

    }, [expoPushToken]);

    return (
        <SafeAreaView>
            <Text>{location.x} {location.y}</Text>
            {bus && (
                <>
                    <Text>{bus.id} {bus.name}</Text>
                    <BusView bus={bus}></BusView>
                    <StopButtonView bus={bus} uuid={uuid} socket={socket}></StopButtonView>
                    
                </>
            )}
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            <Button
                title="Press to Send Notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            />
        </SafeAreaView>
    )
}
