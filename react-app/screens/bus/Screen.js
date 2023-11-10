import { SafeAreaView, Text, View } from "react-native";
import LocationView from "./views/LocationView";
import { colors } from "../../styles/colors";

export default function Screen({ navigation }) {

    return (
        <SafeAreaView style={{ backgroundColor: colors.white }}>
            <LocationView navigation={navigation}></LocationView>
        </SafeAreaView>
    )
}

