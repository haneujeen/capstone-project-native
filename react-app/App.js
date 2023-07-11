import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StationListScreen from './screens/StationListScreen';
import BusStationScreen from './screens/BusStationScreen';
import SubwayStationScreen from './screens/SubwayStationScreen';
import BusScreen from './screens/BusScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="StationList" component={StationListScreen} />
                <Stack.Screen name="BusStation" component={BusStationScreen} />
                <Stack.Screen name="SubwayStation" component={SubwayStationScreen} />
                <Stack.Screen name="Bus" component={BusScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
