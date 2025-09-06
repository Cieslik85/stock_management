import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
