import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import BusScreen from './screens/bus/Screen';
import Scanner from './screens/subway/Scanner';
import SubwayScreen from './screens/subway/Screen';
import { colors } from './styles/colors';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: Internal React error']);

const Stack = createStackNavigator();
const headerStyle = {
    backgroundColor: colors.white,
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
                        title: '',
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name="BusScreen" 
                    component={BusScreen}
                    options={{
                        title: "내 버스",
                        headerStyle: headerStyle,
                    }}
                />
                <Stack.Screen
                    name="Scanner"
                    component={Scanner}
                    options={{
                        headerStyle: headerStyle,
                    }}
                />
                <Stack.Screen
                    name="SubwayScreen"
                    component={SubwayScreen}
                    options={{
                        title: "내 열차",
                        headerStyle: headerStyle,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
