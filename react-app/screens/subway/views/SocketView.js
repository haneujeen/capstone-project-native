import { useEffect, useState } from "react";
import { getSubwaySocket } from "../../../api/socket_service";
import { SafeAreaView, Text } from "react-native";
import TrainView from "./TrainView";

export default function SocketView({ trainId }) {
    const [ socket, setSocket ] = useState(null);
    const [ train, setTrain ] = useState(null);

    trainId = 3400;

    useEffect(() => {
        let socket = getSubwaySocket(trainId, setTrain);
        setSocket(socket);
    }, [])
    

    return (
        <SafeAreaView>
            <Text>{trainId}</Text>
            {train && (
                <>
                    <Text>{train.number} {train.line}</Text>
                    <TrainView train={train}></TrainView>
                </>
            )}
        </SafeAreaView>
    )
}