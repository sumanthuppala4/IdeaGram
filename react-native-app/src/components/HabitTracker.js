import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Card, Badge } from './UI';

const HabitTracker = ({ habits = [], onHabitPress = () => {}, onCompleteHabit = () => {} }) => {
  const HabitItem = ({ item }) => (
    <Card style={styles.habitCard}>
      <View style={styles.habitHeader}>
        <Text style={styles.habitTitle}>{item.name}</Text>
        <Badge text={item.frequency} variant="info" />
      </View>
      <Text style={styles.habitDescription}>{item.description}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(item.completedDays / item.targetDays) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {item.completedDays}/{item.targetDays} days
        </Text>
      </View>
      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => onCompleteHabit(item._id)}
        >
          <Text style={styles.actionButtonText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => onHabitPress(item._id)}
        >
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <HabitItem item={item} />}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Create one to get started!</Text>
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
  habitCard: {
    marginBottom: spacing.md,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  habitDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    marginVertical: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  },
  habitActions: {
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
  completeButton: {
    backgroundColor: colors.success,
  },
  detailsButton: {
    backgroundColor: colors.info,
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

export default HabitTracker;
