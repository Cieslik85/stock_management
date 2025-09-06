import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export default function Index() {
  return (
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
        <Stack.Screen name="ProductStock" component={ProductStockScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
      </Stack.Navigator>
  );
}
