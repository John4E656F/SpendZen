import { useClerk, useSignUp, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import { saveUserToDb } from '@/lib';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Preload browser for better UX (Android especially)
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
// Complete any OAuth session (required by Expo)
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  useWarmUpBrowser();
  const { isLoaded, signUp } = useSignUp();
  const clerk = useClerk();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Google sign up handler
  const onGoogleSignUp = useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        const user = clerk.user;
        if (user) {
          await saveUserToDb(user);
          console.log(user);
        }
        router.replace('/onboarding/onboarding');
      }
    } catch (err: any) {
      Alert.alert('Google Sign Up Error', err.errors?.message || err.message || 'Unable to sign up with Google');
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  // Email/password sign up
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error signing up', err.errors?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Email verification
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await clerk.setActive({ session: completeSignUp.createdSessionId });
        const user = clerk.user;
        if (user) {
          await saveUserToDb(user);
        }
        router.replace('/onboarding/onboarding');
      } else {
        Alert.alert('Verification failed', 'Please check your code and try again.');
      }
    } catch (err: any) {
      Alert.alert('Error verifying email', err.errors?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
      // Redirect to your desired page
      router.replace('/');
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle='dark-content' />
        <View style={styles.container}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>Enter the code sent to your inbox.</Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder='Verification Code'
            keyboardType='number-pad'
            onChangeText={setCode}
            editable={!loading}
          />
          <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={onVerifyPress} disabled={loading}>
            {loading ? <ActivityIndicator color='#FFFFFF' /> : <Text style={styles.buttonText}>Verify & Continue</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your journey to mindful spending.</Text>
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
        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={onSignUpPress} disabled={loading}>
          {loading ? <ActivityIndicator color='#FFFFFF' /> : <Text style={styles.buttonText}>Continue</Text>}
        </TouchableOpacity>
        {/* Google Sign Up with Icon */}
        <TouchableOpacity style={[styles.button, styles.googleButton, loading && styles.disabledButton]} onPress={onGoogleSignUp} disabled={loading}>
          <View style={styles.googleContent}>
            {loading ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.buttonText}>
                {' '}
                <AntDesign name='google' size={22} color='white' style={styles.googleIcon} /> Sign Up with Google
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut}>
          <Text>Sign out</Text>
        </TouchableOpacity>
        <View style={styles.loginRedirect}>
          <Text style={styles.text}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')} disabled={loading}>
            <Text style={[styles.text, styles.link]}>Log In</Text>
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
  loginRedirect: {
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
