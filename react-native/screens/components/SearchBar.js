// screens/components/SearchBar.js

import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ value, onChangeText, carType }) {
    const placeholder = `Search ${carType === 'bus' ? 'a bus stop' : 'a subway station'}`;
    const iconStyle = {
        color: value ? 'hsla(0, 0%, 30%, 1)' : 'hsla(0, 0%, 70%, 1)', 
        marginRight: 10
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={carType ? placeholder : "Select vehicle type"}
                    editable={!!carType}
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={iconStyle} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        height: 40,
        width: '80%',
        marginTop: 10,
        borderRadius: 13,
        paddingLeft: 10,
    },
    textInput: {
        flex: 1,
    },
});
