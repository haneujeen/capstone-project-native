import { useState, useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";
import { getBusSocket } from '../../../api/socket_service';

export default function BusView() {
    const [ socket, setSocket ] = useState(null);
    const [ bus, setBus ] = useState(null);

    useEffect(() => {
        try {
            let socket = getBusSocket(location, setBus);
            setSocket(socket);
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <SafeAreaView>
            <Text>View</Text>
        </SafeAreaView>
    )
}
