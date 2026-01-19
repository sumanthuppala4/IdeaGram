import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HabitTracker from '../components/HabitTracker';
import Challenges from '../components/Challenges';
import Leaderboard from '../components/Leaderboard';
import { habitsApi, challengesApi, leaderboardApi } from '../utils/api';
import { setHabits } from '../store/habitsSlice';
import { setChallenges } from '../store/challengesSlice';
import { setLeaderboard } from '../store/leaderboardSlice';
import { colors, spacing, typography } from '../styles/theme';
import { Button } from '../components/UI';

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');
  const dispatch = useDispatch();
  const { habits } = useSelector((state) => state.habits);
  const { challenges } = useSelector((state) => state.challenges);
  const { leaderboard } = useSelector((state) => state.leaderboard);
  const { user } = useSelector((state) => state.auth);

  const loadData = async () => {
    try {
      const [habitsRes, challengesRes, leaderboardRes] = await Promise.all([
        habitsApi.getAll(),
        challengesApi.getAll(),
        leaderboardApi.getAll(),
      ]);

      dispatch(setHabits(habitsRes.data));
      dispatch(setChallenges(challengesRes.data));
      dispatch(setLeaderboard(leaderboardRes.data));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleCreateChallenge = () => {
    navigation.navigate('CreateChallenge');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <Text style={styles.subtitleText}>Your habit tracking dashboard</Text>
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          title="Habits"
          active={activeTab === 'habits'}
          onPress={() => setActiveTab('habits')}
        />
        <TabButton
          title="Challenges"
          active={activeTab === 'challenges'}
          onPress={() => setActiveTab('challenges')}
        />
        <TabButton
          title="Leaderboard"
          active={activeTab === 'leaderboard'}
          onPress={() => setActiveTab('leaderboard')}
        />
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'habits' && (
          <>
            <Button title="Create Habit" onPress={handleCreateHabit} />
            <HabitTracker
              habits={habits}
              onHabitPress={(id) => navigation.navigate('HabitDetail', { id })}
            />
          </>
        )}

        {activeTab === 'challenges' && (
          <>
            <Button title="Create Challenge" onPress={handleCreateChallenge} />
            <Challenges
              challenges={challenges}
              onChallengePress={(id) => navigation.navigate('ChallengeDetail', { id })}
            />
          </>
        )}

        {activeTab === 'leaderboard' && <Leaderboard users={leaderboard} />}
      </View>
    </ScrollView>
  );
};

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabButtonTextActive: {
    color: colors.surface,
  },
  contentContainer: {
    padding: spacing.md,
    minHeight: 400,
  },
});

export default DashboardScreen;
