export const createProduct = (token, product) =>
    axios.post(`${API_URL}/api/products`, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000'; // e.g., http://192.168.1.10:5000

export const login = (email, password) =>
    axios.post(`${API_URL}/api/auth/login`, { email, password });

export const fetchProducts = (token) =>
    axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const fetchStock = (token) =>
    axios.get(`${API_URL}/api/stock`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const fetchCategories = (token) =>
    axios.get(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const fetchStockMovements = (token) =>
    axios.get(`${API_URL}/api/stock-movements`, {
        headers: { Authorization: `Bearer ${token}` }
    });