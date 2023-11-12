import { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Alert, Animated, FlatList, Image } from "react-native";

import styles from '../../../styles/BusViewStyles';
import { colors } from '../../../styles/colors';
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'uuid';

export default function BusView({ bus, socket, navigation, sendPushNotification, expoPushToken }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    let deviceName = Device.deviceName;
    let modelName = Device.modelName;
    let uuid = uuidv4();

    useEffect(() => {
        if (bus.name) {
            navigation.setOptions({ title: bus.name });
        }
    }, [bus]);

    const [fadeAnim] = useState(new Animated.Value(1));  

    useEffect(() => {
        const blinkAnimation = () => {
            const blink = Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]);
            blink.start(() => blinkAnimation());
        };
        blinkAnimation(); 

        return () => {
            socket.close();
        }
    }, []);

    const prevStationNameRef = useRef();

    useEffect(() => {
        if (prevStationNameRef.current !== bus.station.name) {
            prevStationNameRef.current = bus.station.name;

            let title = `버스 ${bus.name}에 대한 알림`;
            let body = `이번 정거장은 ${bus.station.name}입니다. 다음 정거장은 ${bus.next_station.name}입니다.`;

            sendPushNotification(expoPushToken, title, body);
        }
    }, [expoPushToken, bus]);


    const getFontSize = (nameLength) => {
        const maxFontSize = 60;
        const minFontSize = 32;
        return maxFontSize - (maxFontSize - minFontSize) * (nameLength - 3) / (12 - 3);
    }
    
    const messages = [
        {
            icon: require('../../../assets/warning.png'),
            text: '이 버스는 오늘의 마지막 버스에요.'
        },
        {
            icon: require('../../../assets/warning.png'),
            text: '현재 이 버스는 만석이에요.'
        },
        {
            icon: require('../../../assets/brightness.png'),
            text: `현재 ${bus.desc.speed} (km/h)의 속도로 운행하고 있어요.`
        },
        {
            icon: require('../../../assets/brightness.png'),
            text: `다음 정거장까지 ${bus.desc.travel_time}초 남았어요.`
        },
        {
            icon: require('../../../assets/brightness.png'),
            text: bus.traffic_info
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.display}>
                <View style={[styles.iconTextView, {position: 'absolute', top: 12, right: 15}]}>
                    <Image source={require('../../../assets/running-2.png')} style={{ width: 21, height: 21, marginEnd: 3, }} />
                    <Text style={{color: colors.orange, marginEnd: 15, }}>{bus.desc.speed} km/h</Text>
                    <Image source={require('../../../assets/clock.png')} style={{ width: 18, height: 18, marginEnd: 5, }} />
                    <Text style={{color: colors.orange}}>{bus.desc.travel_time}</Text>
                </View>
                <Text style={{color: colors.white, fontSize: getFontSize(bus.station.name.length)}}>{bus.station.name}</Text>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.displayText}>다음 정거장은 {bus.next_station.name}</Text>
                </Animated.View>
                <TouchableOpacity 
                    style={[
                        styles.touchableItem, 
                        isButtonDisabled ? styles.disabledButton : null
                    ]} 
                    disabled={isButtonDisabled} 
                    onPress={() => {
                        Alert.alert(
                            `${bus.station.name}에서 내릴까요?`,
                            `${deviceName} ${modelName} 으로부터...`,
                            [
                                {
                                    text: "아니요",
                                    onPress: () => {
                                        console.log("No Pressed");
                                    },
                                    style: "cancel"
                                },
                                {
                                    text: "네",
                                    onPress: () => {
                                        setIsButtonDisabled(true);
                                        console.log(`https://bus-company-server.com/stop_request\n* 요청 UUID: ${uuid}\n* 하차 정거장: ${bus.station.name}(${bus.station.id})\n* 요청 기기: ${deviceName}(${modelName})\n* 차량 ID(노선): ${bus.id}(${bus.name})\n* 요청 위치: (${bus.longitude}, ${bus.latitude})`)
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }}
                >
                    <Image source={require('../../../assets/hand-wave.png')} style={{ width: 21, height: 21, marginEnd: 5, }} />
                    <Text style={styles.itemText}>내리기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.informationContainer}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.subtitleTextView}>
                            {item.icon && (
                                <Image
                                    source={item.icon}
                                    style={{ width: 21, height: 21, marginEnd: 6 }}
                                />
                            )}
                            <Text style={styles.subtitleText}>{item.text}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
