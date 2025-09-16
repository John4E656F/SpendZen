import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { saveGoalToDb } from '@/lib/';
import { useUserStore } from '@/hooks/';

const totalSteps = 4;

const wantCategories = [
  { name: 'Dining Out', icon: '🍔' },
  { name: 'Hobbies', icon: '🎮' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Gadgets', icon: '💻' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Entertainment', icon: '🎟️' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Subscriptions', icon: '🔁' },
];

const OnboardingStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  console.log('user from store:', user);

  const userId = user?._id ?? '';

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => (prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await saveGoalToDb({
          goalName,
          goalAmount,
          selectedCategories,
          userId, // Pass userId from Zustand store here
        });
        router.replace('/(tabs)/home');
      } catch (error) {
        console.error('Failed to save onboarding data', error);
        // Optionally show alert or feedback to user
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Progress bar width percentage
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Image source={require('../../assets/images/kapyTee.png')} style={styles.image} resizeMode='contain' />
            <Text style={styles.headline}>Start Your Mindful Spending Journey</Text>
            <Text style={styles.bodyText}>Let's get you set up for success on your journey to mindful spending.</Text>
          </>
        );
      case 1:
        return (
          <>
            <Image source={require('../../assets/images/kapyWhat.png')} style={styles.image} resizeMode='contain' />
            <Text style={styles.headline}>What are you saving for?</Text>
            <TextInput placeholder='e.g., Trip to Japan' style={styles.input} value={goalName} onChangeText={setGoalName} />
            <TextInput placeholder='Target Amount ($)' style={styles.input} keyboardType='numeric' value={goalAmount} onChangeText={setGoalAmount} />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.headline}>Which categories tempt you the most?</Text>
            <Text style={[styles.bodyText, { marginBottom: 16 }]}>
              Select a few categories where you tend to make impulse buys. This helps Kapy provide better guidance.
            </Text>
            <View style={styles.categoriesContainer}>
              {wantCategories.map((cat) => {
                const selected = selectedCategories.includes(cat.name);
                return (
                  <TouchableOpacity
                    key={cat.name}
                    style={[styles.categoryButton, selected ? styles.categorySelected : styles.categoryUnselected]}
                    onPress={() => toggleCategory(cat.name)}
                  >
                    <Text style={selected ? styles.categoryTextSelected : styles.categoryTextUnselected}>
                      {cat.icon} {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Image source={require('../../assets/images/kapySuccess.png')} style={styles.image} resizeMode='contain' />
            <Text style={styles.headline}>You're all set!</Text>
            <Text style={styles.bodyText}>
              You've set your first goal and are ready to build healthier financial habits. Let's go to your dashboard.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style='dark' />
      <View style={styles.wrapper}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          {/* Stepper Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderStepContent()}</View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{currentStep === totalSteps - 1 ? 'Go to Dashboard' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
  wrapper: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F0F4F8',
    justifyContent: 'space-between',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: { padding: 8 },
  backArrow: { fontSize: 28, color: '#2D3748' },
  progressBarBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E0',
    marginLeft: 16,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5A7D7C',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 400, height: 400 },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    fontSize: 16,
    marginBottom: 12,
    width: '100%',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    margin: 6,
  },
  categorySelected: {
    backgroundColor: '#5A7D7C',
    borderColor: '#5A7D7C',
  },
  categoryUnselected: {
    backgroundColor: 'white',
    borderColor: '#CBD5E0',
  },
  categoryTextSelected: { color: 'white', fontSize: 16 },
  categoryTextUnselected: { color: '#4A5568', fontSize: 16 },
  footer: {},
  nextButton: {
    backgroundColor: '#5A7D7C',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OnboardingStepper;
