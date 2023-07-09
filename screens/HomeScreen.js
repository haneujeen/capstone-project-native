import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faSubway } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './components/SearchBar';

export default function HomeScreen() {
    const [carType, setCarType] = useState(null);
    const [searchText, setSearchText] = useState('');

    const handleIconPress = (type) => {
        setCarType(type);
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => handleIconPress('bus')} activeOpacity={0.6}>
                    <FontAwesomeIcon icon={faShuttleVan} size={30} style={{ color: carType === 'bus' ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 50%, 1)' }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => handleIconPress('subway')} activeOpacity={0.6}>
                    <FontAwesomeIcon icon={faSubway} size={30} style={{ color: carType === 'subway' ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 50%, 1)' }} />
                </TouchableOpacity>
            </View>
            <SearchBar value={searchText} onChangeText={setSearchText} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'hsla(240, 11%, 96%, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderWidth: 1,
        borderColor: 'hsla(0, 0%, 84%, 1)',
        borderRadius: 10,
        width: '80%',
        height: '23%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    iconContainer: {
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        borderWidth: 1,
        borderColor: 'hsla(0, 0%, 84%, 1)',
        borderRadius: 10,
        width: '45%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
    },
});
