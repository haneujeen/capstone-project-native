export function dummyTrain() {
    return {
        number: 8080,
        line: "1020",
        direction: "Upwards",
        current_station: {
            name: "Hongik Univ. Station",
            id: "1020000200"
        },
        previous_station: {
            id: "1020000199",
            name: "Sinchon"
        },
        next_station: {
            id: "1020000201",
            name: "Hapjeong"
        },
        is_arrived: "50",
        stops_at: "Yeouido",
        type: "subway"
    }
}

export function dummyBus() {
    return {
        id: "220056789",
        name: "72",
        longitude: "126.976021",
        latitude: "37.571640",
        previous_station: {
            id: "206000047",
            name: "Yeouido Park"
        },
        station: {
            id: "220000015",
            name: "Yeouinaru Station Exit 3"
        },
        next_station: {
            id: "220000017",
            name: "Mapo-gu Office Station"
        },
        desc: {
            bus_type: "2",
            travel_time: "10",
            speed: "30",
            is_last: "0",
            is_full: "1",
            plate_number: "서울25나3074"
        }
    }
}