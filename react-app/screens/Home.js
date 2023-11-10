import { SafeAreaView, TouchableOpacity, Text, View, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from '../styles/HomeStyles'
import { useState, useEffect } from "react";
import { colors } from "../styles/colors";

export default function Home() {
    const navigation = useNavigation();
    const footer = "본 프로젝트는 과학기술정보통신부 정보통신창의인재양성사업의 지원을 통해 진행된 ICT멘토링 프로젝트 결과물입니다."
    
    const animatedValue = new Animated.Value(0);
    
    const colorInterpolation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.blue, colors.purple]
    });

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                })
            ])
        ).start();
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <Animated.Text style={{ 
                color: colorInterpolation, 
                fontSize: 50,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 120, 
            }}>
                시작하기
            </Animated.Text>
            <Text style={styles.titleText2}>이동수단을 선택하세요</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.touchableItem}
                    onPress={() => {navigation.navigate("BusScreen")}}
                >
                    <View style={styles.subtitleTextView}>
                    <Image source={require('../assets/bus.png')} style={{ width: 16, height: 16, marginEnd: 3, }} />
                        <Text style={styles.subtitleText}>GPS로</Text>
                    </View>
                    
                    <Text style={styles.boldText}>버스찾기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.touchableItem}
                    onPress={() => {navigation.navigate("Scanner")}}
                >
                    <View style={styles.subtitleTextView}>
                    <Image source={require('../assets/subway.png')} style={{ width: 16, height: 16, marginEnd: 3, }} />
                        <Text style={styles.subtitleText}>QR코드로</Text>
                    </View>
                    <Text style={styles.boldText}>열차찾기</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>{footer}</Text>
        </SafeAreaView>
    )
}

