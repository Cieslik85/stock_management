import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

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
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) return;
                // Get user info from /api/auth/me or similar endpoint
                const res = await axios.get('http://10.0.2.2:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(res.data.username || res.data.email || 'User');
            } catch (err) {
                setUsername(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Menu</Text>
            {loading ? (
                <ActivityIndicator size="small" style={{ marginBottom: 16 }} />
            ) : (
                <Text style={styles.username}>Welcome, {username || 'User'}!</Text>
            )}
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
        marginBottom: 8,
        textAlign: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 16,
        color: '#2563eb',
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
