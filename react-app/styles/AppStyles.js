import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
    textCenter: {
        fontWeight: '100',
        textAlign: 'center',
    },  
    container: {
        flex: 1,
        margin: 16,
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center'
    },
    innerContainer: {
        flexDirection: 'column',
        backgroundColor: colors.light9,
        borderWidth: 0.5,
        borderColor: colors.light8,
        borderRadius: 9,
        width: '100%',
        padding: 8,
        marginVertical: 8,
    },
    innerContainerLight: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: colors.light8,
        borderRadius: 9,
        width: '100%',
        padding: 8,
        marginVertical: 8,
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light7,
        padding: 11,
    },
    textBold: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    description: {
        fontWeight: 'bold',
        fontSize: 15,
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