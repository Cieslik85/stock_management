import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Stock Management</Text>
            <Text style={styles.subtitle}>Manage your products, stock, and orders on the go.</Text>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 32,
        textAlign: 'center',
    },
});
