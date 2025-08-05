import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetchProducts } from '../services/api';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) {
                    navigation.replace('Login');
                    return;
                }
                const res = await fetchProducts(token);
                setProducts(res.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product List</Text>
            <Button title="Logout" onPress={handleLogout} />
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id?.toString() || item.sku}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.sku}>SKU: {item.sku}</Text>
                            <Text style={styles.qty}>Stock: {item.quantity}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginTop: 32,
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sku: {
        fontSize: 14,
        color: '#555',
    },
    qty: {
        fontSize: 14,
        color: '#333',
    },
});
