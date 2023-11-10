import { useEffect, useState, useRef } from "react";
import { getSubwaySocket } from "../../../api/socket_service";
import { View, Text, Image, Animated, Easing } from "react-native";
import TrainView from "./TrainView";
import { colors } from "../../../styles/colors";
import styles from "../../../styles/TrainViewStyles";

export default function SocketView({ trainId, navigation }) {
    const [ socket, setSocket ] = useState(null);
    const [ train, setTrain ] = useState(null);

    
    useEffect(() => {
        let socket = getSubwaySocket(trainId, setTrain);
        setSocket(socket);

        
        
        return () => {
            socket.close();
        }
    }, [])
    

    return (
        <View style={{ height: '100%', backgroundColor: colors.white }}>
            
            {train && (
                <>
                    <TrainView train={train} navigation={navigation}></TrainView>
                </>
            )}
        </View>
    )
}