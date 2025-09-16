import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const onboardingSteps = [
  {
    step: 1,
    image: require('../../assets/images/kappyThinking.png'), // Replace with your real local asset path
    headline: 'Pause and Ponder.',
    body: 'Before any non-essential purchase, our AI coach will ask a few simple questions to help you decide if it’s a want or a need. It’s not about restriction, it’s about awareness.',
  },
  {
    step: 2,
    image: require('../../assets/images/kapySaving.png'),
    headline: 'Give Your Savings a Purpose.',
    body: "Saving is easier when you know what you're saving for. Every mindful choice you make helps you get closer to your biggest goals.",
  },
  {
    step: 3,
    image: require('../../assets/images/kapyThink.png'),
    headline: 'Ready to Start Your Journey?',
    body: 'Create an account to start tracking your goals and building healthier financial habits today.',
  },
];

const OnboardingStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/auth/register');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const { image, headline, body } = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style='dark' />
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Mascot Illustration */}
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} resizeMode='contain' />
        </View>

        {/* Content Area */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>

        {/* Footer with Progress Dots and Button */}
        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
              <View key={index} style={[styles.dot, currentStep === index ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{currentStep === onboardingSteps.length - 1 ? 'Create My Account' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F0F4F8',
    justifyContent: 'space-between',
  },
  header: { height: 50, justifyContent: 'center' },
  backButton: { padding: 8 },
  backArrow: { fontSize: 28, color: '#2D3748' },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 400, height: 400 },
  textContainer: { paddingVertical: 24 },
  headline: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    color: '#718096',
    lineHeight: 22,
  },
  footer: {},
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
  activeDot: { backgroundColor: '#5A7D7C' },
  inactiveDot: { backgroundColor: '#CBD5E0' },
  nextButton: {
    backgroundColor: '#5A7D7C',
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OnboardingStepper;
