import React from 'react';
import { View } from 'react-native';

export function LineMap() {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <View style={{ height: '100%', width: 4, backgroundColor: 'black', position: 'absolute'}}/>
            <View style={{ width: '100%', height: 4, backgroundColor: 'black', position: 'absolute', top: '25%'}}/>
            <View style={{ width: '100%', height: 4, backgroundColor: 'black', position: 'absolute', top: '50%'}}/>
            <View style={{ width: '100%', height: 4, backgroundColor: 'black', position: 'absolute', top: '75%'}}/>
        </View>
    );
};