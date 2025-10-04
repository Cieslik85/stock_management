
import ManageProductScreen from '../screens/ManageProductScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import StockScreen from '../screens/StockScreen';
import ProductStockScreen from '../screens/ProductStockScreen';
import ReportsScreen from '../screens/ReportsScreen';
import UsersScreen from '../screens/UsersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({
          route,
        }: {
          route: { params?: { username?: string } };
        }) => ({
          title: route.params?.username
            ? `Welcome, ${route.params.username}!`
            : 'Main Menu',
        })}
      />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="Stock" component={StockScreen} options={{ title: 'Stock' }} />
      <Stack.Screen name="ProductStock" component={ProductStockScreen} options={{ title: 'Product Stock' }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
    <Stack.Screen name="Users" component={UsersScreen} options={{ title: 'Users' }} />
    <Stack.Screen name="ManageProduct" component={ManageProductScreen} options={{ title: 'Edit Product' }} />
    <Stack.Screen name="AddProduct" component={require('../screens/AddProductScreen').default} options={{ title: 'Add Product' }} />
    </Stack.Navigator>
  );
}
