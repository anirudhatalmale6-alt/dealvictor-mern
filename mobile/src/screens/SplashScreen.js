import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={colors.gradient.primary}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>
          Deal<Text style={styles.logoAccent}>Victor</Text>
        </Text>
        <Text style={styles.tagline}>Your Global Marketplace</Text>
        <ActivityIndicator
          size="large"
          color={colors.white}
          style={styles.loader}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
  },
  logoAccent: {
    color: colors.accent,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;
