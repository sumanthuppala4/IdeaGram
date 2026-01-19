import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Card, Badge } from './UI';

const Challenges = ({ challenges = [], onChallengePress = () => {}, onJoinChallenge = () => {} }) => {
  const ChallengeItem = ({ item }) => (
    <Card style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.name}</Text>
        <Badge text={item.category} variant="secondary" />
      </View>
      <Text style={styles.challengeDescription}>{item.description}</Text>
      <View style={styles.challengeStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Participants</Text>
          <Text style={styles.statValue}>{item.participants?.length || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration} days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Reward</Text>
          <Text style={styles.statValue}>{item.reward} pts</Text>
        </View>
      </View>
      <View style={styles.challengeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={() => onJoinChallenge(item._id)}
        >
          <Text style={styles.actionButtonText}>Join Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => onChallengePress(item._id)}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChallengeItem item={item} />}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No challenges available</Text>
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
  challengeCard: {
    marginBottom: spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  challengeActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: colors.primary,
  },
  viewButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default Challenges;
