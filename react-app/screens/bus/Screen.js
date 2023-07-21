import { SafeAreaView, Text } from "react-native";
import LocationView from "./views/LocationView";

export default function Screen() {
    return (
        <SafeAreaView>
            <Text>Screen</Text>
            <LocationView></LocationView>
        </SafeAreaView>
    )
}

