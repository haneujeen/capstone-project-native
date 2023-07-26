import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ value, onSubmit }) {
    const [localValue, setLocalValue] = useState(value);
    const iconStyle = {
        color: localValue ? 'hsla(0, 0%, 30%, 1)' : 'hsla(0, 0%, 70%, 1)', 
        marginRight: 10
    };

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handlePress = () => {
        if (localValue) {
            Keyboard.dismiss();
            onSubmit(localValue);
            setLocalValue('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setLocalValue}
                    value={localValue}
                    placeholder="Start by Searching Station"
                    onSubmitEditing={handlePress}
                />
                <TouchableOpacity onPress={handlePress} disabled={!localValue}>
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={iconStyle}
                        size={18}
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
        width: '100%',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
    },
});
