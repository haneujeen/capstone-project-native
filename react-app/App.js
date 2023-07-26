import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
            <Stack.Navigator initialRouteName="Entry">
                <Stack.Screen
                    name="Entry"
                    component={Entry}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name="BusScreen" 
                    component={BusScreen}
                    options={{
                        headerStyle: headerStyle,
                    }}
                />
                <Stack.Screen
                    name="Scanner"
                    component={Scanner}
                />
                <Stack.Screen
                    name="SubwayScreen"
                    component={SubwayScreen}
                    options={{
                        headerStyle: headerStyle,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
