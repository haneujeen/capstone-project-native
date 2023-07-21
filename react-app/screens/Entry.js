import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Entry() {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <TouchableOpacity
                onPress={() => {navigation.navigate("BusScreen")}}
            >
                <Text>Bus App</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {navigation.navigate("SubwayScreen")}}
            >
                <Text>Subway App</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}