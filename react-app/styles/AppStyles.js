import { StyleSheet } from 'react-native';

const colors = {
    secondary: "hsla(0, 0%, 53%, 1)", //desc, subtitle & spinner
    light7: "hsla(0, 0%, 84%, 1)", //border
    light9: "hsla(240, 11%, 96%, 1)", //background
    white: "hsla(0, 0%, 100%, 1)",
    blue2: "hsla(211, 86%, 50%, 1)",
    light8: "hsla(9, 8%, 83%, 1)", //redish gray
    black: "hsla(0, 0%, 0%, 1)",
    blue1: "hsla(211, 100%, 55%, 1)", //switch
    green: "hsla(130, 78%, 60%, 1)",
    red: "hsla(3, 100%, 59%, 1)",
    gray: "hsla(9, 18%, 92%, 1)", //innerContainer
}

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light9,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
    },
    innerContainer: {
        flexDirection: 'column',
        backgroundColor: colors.gray,
        borderWidth: 0.2,
        borderColor: 'hsla(0, 0%, 89%, 1)',
        borderRadius: 10,
        width: '100%',
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light7,
        padding: 11,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    description: {
        color: colors.secondary,
        fontSize: 13,
        marginHorizontal: 10,
    },
    iconContainer: {
        backgroundColor: colors.red,
        width: 30,
        borderRadius: 8,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 400,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});