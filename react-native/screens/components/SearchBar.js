import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ value, onChangeText, carType, onSubmit }) {
    const placeholder = `Search only ${carType === 'bus' ? 'bus stops' : 'subway stations'}`;
    const iconStyle = {
        color: value ? 'hsla(0, 0%, 30%, 1)' : 'hsla(0, 0%, 70%, 1)', 
        marginRight: 10
    };

    const handlePress = (event) => {
        if (event.nativeEvent.key === "Enter") {
            Keyboard.dismiss();
            onSubmit();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={carType ? placeholder : "Search all stations"}
                    onKeyPress={value ? handlePress : undefined}
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={iconStyle}
                    onPress={handlePress}
                    disabled={!value}
                />
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
