import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const menuItems = [
    { name: 'Dashboard', icon: 'view-dashboard', screen: 'Dashboard' },
    { name: 'Products', icon: 'cube-outline', screen: 'Products' },
    { name: 'Orders', icon: 'cart-outline', screen: 'Orders' },
    { name: 'Categories', icon: 'shape-outline', screen: 'Categories' },
    { name: 'Stock', icon: 'warehouse', screen: 'Stock' },
    { name: 'Product Stock', icon: 'cube-scan', screen: 'ProductStock' },
    { name: 'Reports', icon: 'file-chart-outline', screen: 'Reports' },
    { name: 'Users', icon: 'account-group-outline', screen: 'Users' },
];

export default function HomeScreen({ navigation }) {
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Menu</Text>
            <View style={styles.menuGrid}>
                {menuItems.map(item => (
                    <TouchableOpacity
                        key={item.name}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Icon name={item.icon} size={40} color="#2563eb" style={{ marginBottom: 8 }} />
                        <Text style={styles.menuText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 32,
    },
    menuItem: {
        width: 120,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2563eb',
        textAlign: 'center',
    },
});
