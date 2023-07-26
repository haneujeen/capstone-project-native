import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import Screen from './Screen';

export default function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        setHasPermission(null); // turn off the scanner
        navigation.navigate('Screen', { trainId: data }); // navigate back to Home screen
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
        style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        flexDirection: 'row',
    },
    url: {
        flex: 1,
    },
    urlText: {
        color: '#fff',
        fontSize: 20,
    },
    cancelButton: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 18,
    },
});
