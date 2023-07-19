import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
    console.log("registerForPushNotificationsAsync: started");
    
    let token;
    
    console.log("Is device: ", Constants.isDevice);

    if (Constants.isDevice) {
        console.log("Requesting permissions...");
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log("Existing permissions status: ", existingStatus);

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            console.log("Permissions not granted. Requesting...");
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log("New permissions status: ", finalStatus);
        }

        if (finalStatus !== 'granted') {
            console.log("Failed to get push token, permissions not granted");
            alert('Failed to get push token for push notification!');
            return;
        }

        console.log("Permissions granted. Getting token...");
        token = (await Notifications.getExpoPushTokenAsync({projectId: 'capstone-project-native'})).data;
        console.log("Received token: ", token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        console.log("Configuring Android notification channel...");
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    console.log("Returning token...");
    return token;
}
