import { StyleSheet, View } from 'react-native';
import Welcome from './src/screens/welcome';
import React from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <Welcome></Welcome>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
