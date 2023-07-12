import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import SearchBar from './components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { fetchBusStations, fetchSubwayStations, fetchAllStations } from '../api/api_service';

export default function HomeScreen() {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    const onSubmit = async (value) => {
        let result;
        let busStationsResults, subwayStationsResults;
        let busStationsMessage, subwayStationsMessage;
        
        result = await fetchBusStations(value);
        if (result.response_code == '0') {
            busStationsResults = result.list;
        } else {
            busStationsMessage = result.message;
        }
        
        result = await fetchSubwayStations(value);
        if (result.response_code == '0') {
            subwayStationsResults = result.list;
        } else {
            subwayStationsMessage = result.message;
        }

        navigation.navigate('StationList', { busStations: busStationsResults, 
                                                busMessage: busStationsMessage,
                                                subwayStations: subwayStationsResults,
                                                subwayMessage: subwayStationsMessage
                                            });
    }

    return (
        <View style={styles.container}>
            <SearchBar value={searchText} onChangeText={setSearchText} onSubmit={onSubmit} />
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
});
