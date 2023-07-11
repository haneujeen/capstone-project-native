import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faSubway } from '@fortawesome/free-solid-svg-icons';
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
        
        busStationsResults = await fetchBusStations(value);
        if (busStationsResults.response_code == '0') {
            busStationsResults = result.list;
        } else {
            busStationsMessage = result.message;
        }
        
        subwayStationsResults = await fetchSubwayStations(value);
        if (subwayStationsResults.response_code == '0') {
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
            <SearchBar value={searchText} onChangeText={setSearchText} carType={carType} onSubmit={onSubmit} />
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
