import * as SecureStore from 'expo-secure-store';
import { login } from '../services/api';

// Store token securely
export async function saveToken(token) {
    await SecureStore.setItemAsync('token', token);
}

// Retrieve token
export async function getToken() {
    return await SecureStore.getItemAsync('token');
}

// Remove token (logout)
export async function removeToken() {
    await SecureStore.deleteItemAsync('token');
}

// Check if user is authenticated
export async function isAuthenticated() {
    const token = await getToken();
    return !!token;
}

// Try to login and save token
export async function authenticate(email, password) {
    const res = await login(email, password);
    const token = res.data.token;
    await saveToken(token);
    return token;
}
