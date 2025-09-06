import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import * as SecureStore from 'expo-secure-store';
import { fetchStock, fetchCategories, fetchStockMovements } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    const [loading, setLoading] = useState(true);
    const [barData, setBarData] = useState(null);
    const [pieData, setPieData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) throw new Error('No token found');

                // Fetch all data in parallel
                const [stockRes, categoriesRes, movementsRes] = await Promise.all([
                    fetchStock(token),
                    fetchCategories(token),
                    fetchStockMovements(token),
                ]);
                const stock = stockRes.data;
                const categories = categoriesRes.data;
                const movements = movementsRes.data;

                // Pie chart: Stock by category
                const categoryMap = {};
                categories.forEach(cat => {
                    categoryMap[cat.id] = cat.name;
                });
                const pieAgg = {};
                stock.forEach(item => {
                    const catName = categoryMap[item.category_id] || 'Other';
                    pieAgg[catName] = (pieAgg[catName] || 0) + item.quantity;
                });
                const pieColors = ['#2563eb', '#10b981', '#f59e42', '#e11d48', '#6366f1', '#f43f5e'];
                let colorIdx = 0;
                const pieChartData = Object.entries(pieAgg).map(([name, population]) => ({
                    name,
                    population,
                    color: pieColors[colorIdx++ % pieColors.length],
                    legendFontColor: '#333',
                    legendFontSize: 14,
                }));

                // Bar chart: Stock movements per month
                const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const movementAgg = Array(12).fill(0);
                movements.forEach(mov => {
                    const date = new Date(mov.created_at);
                    const month = date.getMonth();
                    movementAgg[month] += mov.quantity;
                });
                const currentMonth = new Date().getMonth();
                const barLabels = monthLabels.slice(0, currentMonth + 1);
                const barValues = movementAgg.slice(0, currentMonth + 1);
                const barChartData = {
                    labels: barLabels,
                    datasets: [{ data: barValues }],
                };

                setPieData(pieChartData);
                setBarData(barChartData);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            ) : error ? (
                <Text style={{ color: 'red', marginTop: 32 }}>{error}</Text>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>Stock Movement (Bar Chart)</Text>
                    {barData && (
                        <BarChart
                            data={barData}
                            width={screenWidth - 32}
                            height={220}
                            yAxisLabel=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                        />
                    )}
                    <Text style={styles.sectionTitle}>Stock by Category (Pie Chart)</Text>
                    {pieData && (
                        <PieChart
                            data={pieData}
                            width={screenWidth - 32}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    )}
                </>
            )}
        </ScrollView>
    );
}

const chartConfig = {
    backgroundGradientFrom: '#f8fafc',
    backgroundGradientTo: '#f8fafc',
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 8,
        color: '#2563eb',
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
