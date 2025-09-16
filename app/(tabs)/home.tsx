import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { DecisionData } from '@/types';
import { useUserStore, useGoalStore, useSavingsStore, useDecisionsStore } from '@/hooks/';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  // Zustand selectors for user and goals
  const user = useUserStore((state) => state.user);
  const goals = useGoalStore((state) => state.goals);
  const setTotalSavings = useSavingsStore((state) => state.setTotalSavings);
  const setRecentDecisions = useDecisionsStore((state) => state.setRecentDecisions);
  const totalSavings = useSavingsStore((state) => state.totalSavings);
  const recentDecisions = useDecisionsStore((state) => state.recentDecisions);
  useEffect(() => {
    console.log('Goals from store:', goals);
  }, []);

  // For this example, use the first goal as primaryGoal if available
  const primaryGoal =
    goals.length > 0
      ? goals[0]
      : {
          goalName: 'No goal set',
          currentAmount: 0,
          goalAmount: 1,
          _id: '',
          userId: '',
          status: 'active',
          selectedCategories: [],
        };

  console.log('Primary Goal:', primaryGoal);

  // Calculate progress safely
  const goalProgress = (primaryGoal.currentAmount / primaryGoal.goalAmount) * 100;

  // Mock refresh function simulating data fetch from backend
  useEffect(() => {
    const mockTotalSavings = 1234.56;
    const mockRecentDecisions: DecisionData[] = [
      {
        _id: '1',
        userId: 'user123',
        itemId: 'item001',
        listedPrice: 100,
        discountedPrice: 90,
        discountAmount: 10,
        finalPrice: 90,
        decision: 'buy',
        isGift: false,
        reason: 'Needed for work',
        createdAt: '2025-09-10T12:00:00Z',
        updatedAt: '2025-09-10T12:00:00Z',
      },
      {
        _id: '2',
        userId: 'user123',
        itemId: 'item002',
        listedPrice: 5,
        discountedPrice: 5,
        discountAmount: 0,
        finalPrice: 5,
        decision: 'skip',
        isGift: false,
        createdAt: '2025-09-12T08:00:00Z',
        updatedAt: '2025-09-12T08:00:00Z',
      },
    ];

    setTotalSavings(mockTotalSavings);
    setRecentDecisions(mockRecentDecisions);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style='dark' />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</Text>
        </View>

        {/* Primary Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalRow}>
            <Text style={styles.goalTitle}>{primaryGoal.goalName}</Text>
            <Text style={styles.goalPercent}>{Math.round(goalProgress)}%</Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${goalProgress}%` }]} />
          </View>
          <Text style={styles.goalAmount}>
            ${primaryGoal.currentAmount.toLocaleString()} / ${primaryGoal.goalAmount.toLocaleString()}
          </Text>
        </View>

        {/* Total Savings & CTA */}
        <View style={styles.savingsRow}>
          {/* Total Savings */}
          <View style={styles.savingsCard}>
            <Text style={styles.savingsLabel}>Mindful Savings</Text>
            <Text style={styles.savingsAmount}>${totalSavings.toFixed(2)}</Text>
          </View>

          {/* CTA Button to AI Chat */}
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/decision/new')}>
            <Text style={styles.ctaButtonText}>Should I Buy This?</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          {recentDecisions.length > 0 ? (
            recentDecisions.map((decision) => (
              <View key={decision._id} style={styles.emptyActivityCard}>
                <Text>{decision.reason || 'No reason provided'}</Text>
                <Text style={{ color: '#718096', fontSize: 12 }}>{decision.createdAt ? new Date(decision.createdAt).toLocaleDateString() : ''}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyActivityCard}>
              <Image source={{ uri: 'https://placehold.co/128x128/A2B4A3/FFFFFF?text=Kakei' }} style={styles.activityImage} resizeMode='contain' />
              <Text style={styles.readyText}>Ready to start?</Text>
              <Text style={styles.emptyActivityText}>Tap "Should I Buy This?" to begin your first mindful decision and see your savings grow.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
  scrollView: { padding: 24 },
  header: { marginBottom: 24 },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2D3748',
  },
  goalPercent: {
    fontWeight: '600',
    color: '#5A7D7C',
    fontSize: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#CBD5E0',
    borderRadius: 6,
    width: '100%',
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#5A7D7C',
    borderRadius: 6,
  },
  goalAmount: {
    textAlign: 'right',
    color: '#718096',
    fontSize: 14,
  },
  savingsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  savingsCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsLabel: {
    color: '#718096',
    marginBottom: 6,
    fontSize: 16,
  },
  savingsAmount: {
    color: '#5A7D7C',
    fontSize: 28,
    fontWeight: 'bold',
  },
  ctaButton: {
    flex: 1,
    backgroundColor: '#5A7D7C',
    padding: 20,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activitySection: { marginBottom: 48 },
  activityTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 18,
  },
  emptyActivityCard: {
    backgroundColor: 'white',
    padding: 36,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  activityImage: { width: 128, height: 128, marginBottom: 20 },
  readyText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#5A7D7C',
    marginBottom: 8,
  },
  emptyActivityText: {
    color: '#718096',
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 12,
  },
});

export default HomeScreen;
