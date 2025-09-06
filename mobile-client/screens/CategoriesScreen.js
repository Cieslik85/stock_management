import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
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
