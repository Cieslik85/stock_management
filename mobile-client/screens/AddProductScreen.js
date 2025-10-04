import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createProduct, fetchCategories } from '../services/api';

export default function AddProductScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        quantity: '',
        category_id: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const res = await fetchCategories(token);
                setCategories(res.data);
            } catch (err) {
                setError('Failed to load categories');
            }
        };
        loadCategories();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            await createProduct(token, {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            });
            Alert.alert('Success', 'Product created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            if (err.response?.data?.message?.includes('SKU already exists')) {
                setError('A product with this SKU already exists.');
            } else {
                setError('Failed to create product. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={formData.name}
                    onChangeText={v => handleChange('name', v)}
                />
            </View>
            <View style={styles.fieldWrapper}>
                <Text style={styles.label}>SKU</Text>
                <TextInput
                    style={styles.input}
                    placeholder="SKU"
                    value={formData.sku}
                    onChangeText={v => handleChange('sku', v)}
                />
            </View>
            <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={formData.description}
                    onChangeText={v => handleChange('description', v)}
                />
            </View>
            <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={formData.price}
                    onChangeText={v => handleChange('price', v)}
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChangeText={v => handleChange('quantity', v)}
                    keyboardType="number-pad"
                />
            </View>
            <View style={styles.pickerWrapper}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal style={styles.categoryScroll}>
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            title={cat.name}
                            color={formData.category_id === cat.id ? '#2563eb' : '#ccc'}
                            onPress={() => handleChange('category_id', cat.id)}
                        />
                    ))}
                </ScrollView>
            </View>

            <Button title={loading ? 'Creating...' : 'Create Product'} onPress={handleSubmit} disabled={loading} />
            <Button title="Cancel" color="#e11d48" onPress={() => navigation.goBack()} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f8fafc',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    pickerWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    categoryScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    fieldWrapper: {
        marginBottom: 8,
    },
});
