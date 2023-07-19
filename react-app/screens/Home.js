import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Linking, Button, Platform } from 'react-native';
import axios from 'axios';

import SearchBar from './components/SearchBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchBusStations, fetchSubwayStations } from '../api/api_service';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    const onSubmit = async (value) => {
        let result;
        let busStationsResults, subwayStationsResults;
        let busStationsMessage, subwayStationsMessage;

        result = await fetchBusStations(value);
        if (result.status === 200) {
            busStationsResults = result.data.list;
        } else {
            busStationsMessage = result.data.message;
        }

        result = await fetchSubwayStations(value);
        if (result.status === 200) {
            subwayStationsResults = result.data.list;
        } else {
            subwayStationsMessage = result.data.message;
        }

        navigation.navigate('List', {
            busStations: busStationsResults,
            busMessage: busStationsMessage,
            subwayStations: subwayStationsResults,
            subwayMessage: subwayStationsMessage
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Overview</Text>
                <Text style={styles.description}>The application is to provide information on 
                    public transport system in Seoul, with real-time data APIs from the city government, 
                    including all the bus/subway stations, arriving bus/trains, and location of vehicles, etc. 
                    {"\n"}This project is undertaken as part of academic curriculum. 
                    For more info: <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/haneujeen/capstone-project-react')}>capstone-project-react</Text></Text>
            </View>
            <View style={styles.searchContainer}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <SearchBar value={searchText} onChangeText={setSearchText} onSubmit={onSubmit} />
                </View>
            </View>
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'hsla(240, 11%, 96%, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        position: 'relative'
    },
    textContainer: {
        position: 'absolute', 
        top: 90, 
        justifyContent: 'flex-start', 
        width: '100%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    description: {
        color: 'hsla(0, 0%, 53%, 1)',
        fontSize: 13,
        marginHorizontal: 10,
    },
    link: {
        fontWeight: 'bold',
    },
    searchContainer: {
        flex: 1, 
        justifyContent: 'center', 
        width: '100%', 
    },
});


