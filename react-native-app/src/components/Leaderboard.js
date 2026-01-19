import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Badge } from './UI';

const Leaderboard = ({ users = [] }) => {
  const LeaderboardItem = ({ item, index }) => {
    const getMedalColor = (position) => {
      switch (position) {
        case 0:
          return '#FFD700'; // Gold
        case 1:
          return '#C0C0C0'; // Silver
        case 2:
          return '#CD7F32'; // Bronze
        default:
          return colors.border;
      }
    };

    return (
      <View style={[styles.leaderboardItem, index === 0 && styles.topItem]}>
        <View style={[styles.medal, { backgroundColor: getMedalColor(index) }]}>
          <Text style={styles.medalText}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreValue}>{item.points}</Text>
          <Text style={styles.scoreLabel}>points</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => <LeaderboardItem item={item} index={index} />}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No leaderboard data available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  topItem: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  medal: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.md,
  },
  medalText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textLight,
  },
  scoreSection: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default Leaderboard;
