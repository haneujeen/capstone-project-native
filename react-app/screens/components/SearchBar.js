import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ value, carType, onSubmit }) {
    const [localValue, setLocalValue] = useState(value);
    const placeholder = `Search only ${carType === 'bus' ? 'bus stops' : 'subway stations'}`;
    const iconStyle = {
        color: localValue ? 'hsla(0, 0%, 30%, 1)' : 'hsla(0, 0%, 70%, 1)', 
        marginRight: 10
    };

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handlePress = () => {
        if (localValue) {
            console.log("button pressed");
            Keyboard.dismiss();
            onSubmit(localValue);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setLocalValue}
                    value={localValue}
                    placeholder={carType ? placeholder : "Search all stations"}
                    onSubmitEditing={handlePress} // use onSubmitEditing instead of onKeyPress
                />
                <TouchableOpacity onPress={handlePress} disabled={!localValue}>
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={iconStyle}
                    />
                </TouchableOpacity>
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
