import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    display: {
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height: 255,
        backgroundColor: colors.systemGray5Dark,
        borderRadius: 25,
        marginHorizontal: 15,
        marginVertical: 20,
        padding: 12,
    },
    displayText: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 16,
        marginTop: 8,
    },
    pillBox: {
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
    },
    pill: {
        backgroundColor: colors.systemGray3Dark,
        borderRadius: 18,
        padding: 7,
        marginHorizontal: 3,
        alignItems: 'center',
    },
    pillText: {
        color: colors.white,
    },
    rail: {
        width: '98%',
        backgroundColor: colors.black,
        borderRadius: 24,
        padding: 6,
        marginHorizontal: 4,
        marginBottom: 15,
        alignItems: 'center',
    },
    train: {
        width: '20%',
        backgroundColor: colors.systemGray5Dark,
        borderRadius: 18,
        padding: 8,
        marginHorizontal: 4,
    },
    textBox: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },    
    liner: {
        marginTop: 40,
        width: '98%',
        height: '0.2%',
        backgroundColor: colors.systemGray3Dark,
    },
    iconTextView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.systemGray6,
        borderRadius: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 8,
    },
    infoText: {
        marginEnd: 40,
        fontSize: 15,
    }, 
    text1: {
        color: colors.mint,
    },
    text2: {
        fontSize: 21,
        color: colors.systemGray2,
        textAlign: 'center',
    },
    text3: {
        fontSize: 15,
        color: colors.mint,
        fontWeight: 'bold',
    },
    text4: {
        fontSize: 23,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },   
});