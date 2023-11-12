import { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Animated, Easing } from "react-native";
import { fetchStationsOnRoute } from '../../../api/api_service';
import FacilitiesView from './FacilitesView';
import styles from '../../../styles/TrainViewStyles';
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

export default function TrainView({ train, navigation }) {
    const [stationsOnRoute, setStationsOnRoute] = useState(null);
    const [destination, setDestination] = useState(null);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const translateX = useRef(new Animated.Value(0)).current;
    const stationNameRef = useRef();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 22,
                    duration: 2000,
                    easing: Easing.elastic(1),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.elastic(1),
                    useNativeDriver: true,
                }),
            ]),
        ).start();

        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
        });

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
            stationNameRef.current = null;
        };
    }, []);

    // useEffect for updating navigation title
    useEffect(() => {
        if (train.current_station.name) {
            navigation.setOptions({ title: `${train.current_station.name}역` });
        }
    }, [train.current_station.name, navigation]);

    

    useEffect(() => {
        stationNameRef.current = "";
        console.log(stationNameRef);
        if (stationNameRef.current !== train.current_station.name) {
            stationNameRef.current = train.current_station.name;

            let title = `${train.number}번 열차에 대한 알림`;
            let body = `이번 역은 ${train.current_station.name}역입니다. 다음 역은 ${train.next_station.name}역입니다. 가시는 목적지를 확인하시고 하차하시기 바랍니다.`;

            sendPushNotification(expoPushToken, title, body);
        }

    }, [expoPushToken, train]);


    return (
        <View styles={styles.container}>
            <View style={styles.display}>

                <View style={styles.pillBox}>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>{train.direction}</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>{train.number}</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>{train.stops_at}행</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>
                            {train.is_arrived === '99' ? <Text>운행 중</Text> : <Text>정차 중</Text>}
                        </Text>
                    </View>
                </View>

                <View style={styles.liner}>
                </View>
                <View style={[styles.textBox, { marginTop: 68 }]}>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text1}>지난 역</Text>
                    </View>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text3}>이번 역</Text>
                    </View>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text1}>다음 역</Text>
                    </View>
                </View>

                <View style={[styles.textBox, { marginBottom: 20 }]}>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text2}>{train.previous_station.name}역</Text>
                    </View>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text4}>{train.current_station.name}역</Text>
                    </View>
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <Text style={styles.text2}>{train.next_station.name}역</Text>
                    </View>
                </View>

                <View style={styles.rail}>
                    <View style={styles.train}>
                        <Animated.View style={{ transform: [{ translateX }] }}>
                            <Image source={require('../../../assets/train.png')} style={{ width: 18, height: 18, marginHorizontal: 5, }} />
                        </Animated.View>
                    </View>
                    
                </View>
                </View>
            <FacilitiesView stationName={train.current_station.name}></FacilitiesView>
        </View>
    )
}