import { Link } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WelcomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        {/* Mascot Illustration */}
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/images/kapyWelcome.png')} style={styles.image} resizeMode='contain' />
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Welcome to SpendZen</Text>

        {/* Body Text */}
        <Text style={styles.body}>Find your financial balance and align spending with your goals, one mindful decision at a time.</Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Register Button */}
          <Link href='/onboarding' asChild>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </Link>

          {/* Log In Button */}
          <Link href='/auth/login' asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F0F4F8',
  },
  imageWrapper: {
    marginBottom: 48,
  },
  image: {
    width: 192,
    height: 192,
    borderRadius: 96,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2D3748',
    marginBottom: 16,
  },
  body: {
    fontSize: 18,
    textAlign: 'center',
    color: '#718096',
    marginBottom: 48,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 16,
  },
  registerButton: {
    backgroundColor: '#5A7D7C',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#5A7D7C',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#5A7D7C',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
