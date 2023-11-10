import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { fetchFacilities } from "../api/api_service";
import styles from '../../../styles/TrainViewStyles';

export default function FacilitiesView({ stationName }) {
    const [facilities, setFacilities] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFacilities(stationName);
                console.log("Fetched facilities:", data);
                setFacilities(data);
            } catch (error) {
                console.error("Error fetching facilities:", error);
            }
        };

        fetchData();
    }, [stationName]);

    return (
        <View>
            {facilities && (
                <>
                    <View style={styles.infoBox}>
                        <Image source={require('../../../assets/sparkles.png')} style={{ width: 26, height: 26, marginHorizontal: 5, }} />
                        <Text style={styles.infoText}>{facilities.data.accessibility}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Image source={require('../../../assets/sparkles.png')} style={{ width: 26, height: 26, marginHorizontal: 5, }} />
                        <Text style={styles.infoText}>{facilities.data.poi.sentence}</Text>
                    </View>
                    {/*
                    <Text>{facilities.list[0]}</Text>
                    <Text>{facilities.list[1]}</Text>
                    */}
                    
                </>
            )}
        </View>
    )
}
