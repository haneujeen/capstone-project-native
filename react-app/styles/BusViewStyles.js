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
        height: '30%',
        backgroundColor: colors.black,
        borderRadius: 18,
        marginHorizontal: 15,
        padding: 12,
    },
    displayText: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 16,
        marginTop: 8,
    },
    touchableItem: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: colors.systemGray5Dark,
        borderRadius: 9,
        padding: 8,
        marginHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        color: colors.orange,
        fontWeight: '600',
    },
    informationContainer: {
        margin: 15,
        marginTop: 20,
        marginBottom: 170,
        
    },
    iconTextView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitleTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.systemGray6,
        borderRadius: 20,
        marginBottom: 8,
        padding: 12,
    },
    subtitleText: {
        fontSize: 16,
        marginEnd: 20,
        paddingRight: 9,
    },
    boldText: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 14,
        marginHorizontal: 24,
        color: colors.systemGray2,
        marginTop: 140,
        textAlign: 'center'
    },
    disabledButton: {
        opacity: 0.7
    }    
});