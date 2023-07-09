import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faSubway } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();

    const handleIconPress = () => {
        navigation.navigate('Details');
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={handleIconPress} activeOpacity={0.6}>
                    <FontAwesomeIcon icon={faShuttleVan} style={{ fontSize: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={handleIconPress} activeOpacity={0.6}>
                    <FontAwesomeIcon icon={faSubway} style={{ fontSize: 24 }} />
                </TouchableOpacity>
            </View>
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
        borderRadius: 14,
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
        borderRadius: 13,
        width: '45%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
    },
});
