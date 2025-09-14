import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Preload browser for smoother experience on Android
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google login handler
  const onGoogleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert('Google Sign In Error', err.errors?.[0]?.message || err.message || 'Unable to sign in with Google');
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  // Email/password login handler
  const onLoginPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Additional verification needed.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      Alert.alert('Sign in error', err.errors?.[0]?.message || err.message || 'Failed to sign in');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>

        <TextInput
          style={styles.input}
          autoCapitalize='none'
          keyboardType='email-address'
          value={emailAddress}
          placeholder='Email Address'
          onChangeText={setEmailAddress}
          editable={!loading}
        />
        <TextInput style={styles.input} value={password} placeholder='Password' secureTextEntry onChangeText={setPassword} editable={!loading} />

        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={onLoginPress} disabled={loading}>
          {loading ? <ActivityIndicator color='#FFFFFF' /> : <Text style={styles.buttonText}>Continue</Text>}
        </TouchableOpacity>

        {/* Google Sign In Button with Icon */}
        <TouchableOpacity style={[styles.button, styles.googleButton, loading && styles.disabledButton]} onPress={onGoogleSignIn} disabled={loading}>
          <View style={styles.googleContent}>
            <AntDesign name='google' size={22} color='white' style={styles.googleIcon} />
            {loading ? <ActivityIndicator color='#FFFFFF' /> : <Text style={styles.buttonText}>Sign In with Google</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.registerRedirect}>
          <Text style={styles.text}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')} disabled={loading}>
            <Text style={[styles.text, styles.link]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3748',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#718096',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  button: {
    backgroundColor: '#5A7D7C',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    marginBottom: 12,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: '#718096',
    fontSize: 16,
  },
  link: {
    color: '#5A7D7C',
    fontWeight: 'bold',
  },
});
