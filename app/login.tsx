import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.info}>Login is currently disabled.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  info: {
    fontSize: 18,
    color: '#cbd5e1',
    marginBottom: 24,
  },
}); 