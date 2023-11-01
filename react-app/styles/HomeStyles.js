import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.systemGray6,
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 64,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    titleText2: {
        fontSize: 28,
        fontWeight: '200',
        marginLeft: 20,
        
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 9,
        marginTop: 10,
    },
    touchableItem: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#999',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    subtitleTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 15,
        fontWeight: '400',
        color: colors.gray,
    },
    boldText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 14,
        marginHorizontal: 24,
        color: colors.systemGray2,
        marginTop: 100,
        textAlign: 'center'
    },
});