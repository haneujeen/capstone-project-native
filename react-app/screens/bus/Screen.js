import { SafeAreaView, Text, View } from "react-native";
import LocationView from "./views/LocationView";
import PushNotificationView from "./views/PushNotificationView";
import styles from '../../styles/AppStyles';

export default function Screen() {

    return (
        <SafeAreaView style={styles.viewStyle}>
            <LocationView></LocationView>
        </SafeAreaView>
    )
}

