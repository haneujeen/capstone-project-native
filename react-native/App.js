import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MapLikeScreen from './screens/MapLikeScreen';
import BusStationScreen from './screens/BusStationScreen';
import SubwayStationScreen from './screens/SubwayStationScreen';

// Create the stack navigator
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="MapLike" component={MapLikeScreen} />
                <Stack.Screen name="BusStation" component={BusStationScreen} />
                <Stack.Screen name="SubwayStation" component={SubwayStationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
