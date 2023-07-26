import { SafeAreaView, Text } from "react-native";
import SocketView from "./views/SocketView";

export default function Screen() {
    // const { trainId } = route.params;
    const trainId = 9876;

    return (
        <SafeAreaView>
            <Text>Screen</Text>
            <SocketView trainId={trainId}></SocketView>
        </SafeAreaView>
    )
}