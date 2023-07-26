import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import List from './screens/stations/List';
import BusStation from './screens/stations/BusStation';
import SubwayStationScreen from './screens/SubwayStationScreen';
import Bus from './screens/transport/Bus';
import TrainScreen from './screens/TrainScreen';
import Entry from './screens/Entry';
import BusScreen from './screens/bus/Screen';
import Scanner from './screens/subway/Scanner';
import SubwayScreen from './screens/subway/Screen';

const Stack = createStackNavigator();
const headerStyle = {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerShown: false,
                        title: "Search Stations",
                    }}
                />
                <Stack.Screen
                    name="List"
                    component={List}
                    options={{
                        headerBackTitle: "Search",
                        title: "Select Your Station",
                        headerStyle: headerStyle,
                    }}
                />
                <Stack.Screen
                    name="BusStation"
                    component={BusStation}
                    options={({ route }) => ({
                        headerBackTitle: "Select",
                        title: `${route.params.departure.name} (${route.params.departure.ars_id})`,
                        headerStyle: headerStyle,
                    })}
                />
                <Stack.Screen 
                    name="SubwayStation" 
                    component={SubwayStationScreen} 
                />
                <Stack.Screen 
                    name="Bus" 
                    component={Bus} 
                    options={({ route }) => ({
                        headerBackTitle: "Station",
                        title: `${route.params.bus.name}`,
                        headerStyle: headerStyle,
                    })}
                />
                <Stack.Screen 
                    name="Train" 
                    component={TrainScreen} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
