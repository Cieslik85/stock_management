
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetchProducts } from '../services/api';

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) throw new Error('No token found');
                const res = await fetchProducts(token);
                setProducts(res.data);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sku}>SKU: {item.sku}</Text>
            <Text style={styles.qty}>Stock: {item.quantity}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Products</Text>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id?.toString() || item.sku}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
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
