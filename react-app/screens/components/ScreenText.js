import { StyleSheet, Text, View } from 'react-native';

export function BusDirection(stationName) {
    return `${stationName} 방향`
}

export function BusText(stationName, nextStationName) {
    return (
        <View style={styles.container}>
                <Text style={styles.title}>이번 정거장은</Text>
                <Text style={styles.title}>{stationName}입니다.</Text>
                <Text style={styles.subtitle}>다음 정거장은 {nextStationName}입니다.</Text>
   
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        height: '24%',
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 33,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
});