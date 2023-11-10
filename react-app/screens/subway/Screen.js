import { SafeAreaView, Text, View } from "react-native";
import SocketView from "./views/SocketView";
import { colors } from "../../styles/colors";

export default function Screen({ navigation }) {
    // const { trainId } = route.params;
    const trainId = 1225;

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: colors.white }}>
            <SocketView trainId={trainId} navigation={navigation} ></SocketView>
        </SafeAreaView>
    )
}