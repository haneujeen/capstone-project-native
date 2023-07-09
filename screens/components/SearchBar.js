// screens/components/SearchBar.js

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChangeText }) {
    return (
        <TextInput
            style={styles.searchBar}
            onChangeText={onChangeText}
            value={value}
            placeholder="Search"
        />
    );
}

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: 'hsla(0, 0%, 100%, 1)',
        height: 40,
        width: '80%',
        marginTop: 10,
        borderRadius: 13,
        paddingLeft: 10,
    },
});
