
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetchProducts } from '../services/api';

export default function ProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Load products when screen is focused
    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const loadProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = await SecureStore.getItemAsync('token');
                    if (!token) throw new Error('No token found');
                    const res = await fetchProducts(token);
                    if (isActive) {
                        // Sort products alphabetically by name
                        const sorted = [...res.data].sort((a, b) => a.name.localeCompare(b.name));
                        setProducts(sorted);
                        setFilteredProducts(sorted);
                    }
                } catch (err) {
                    if (isActive) setError(err.message || 'Failed to load products');
                } finally {
                    if (isActive) setLoading(false);
                }
            };
            loadProducts();
            return () => { isActive = false; };
        }, [])
    );

    useEffect(() => {
        if (!search) {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter(
                    p =>
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, products]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ManageProduct', { product: item })}
        >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sku}>SKU: {item.sku}</Text>
            <Text style={styles.qty}>Stock: {item.quantity}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Products</Text>
            <View style={styles.topBar}>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Search by name or SKU"
                    value={search}
                    onChangeText={setSearch}
                />
                <Button title="Add Product" onPress={() => navigation.navigate('AddProduct')} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredProducts}
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
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    searchBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
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
