import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#0056b3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderRadius: 12,
    },
    
    boxText: {
        color: '#aaaaaa',
        textAlign: 'center',
        padding: 16,
        fontSize: 14,
    }
    });