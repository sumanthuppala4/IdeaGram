import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { habitsApi } from '../utils/api';
import { Button, Input, Card } from '../components/UI';
import { colors, spacing } from '../styles/theme';

const CreateHabitScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [targetDays, setTargetDays] = useState('30');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCreate = async () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Habit name is required';
    if (!description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await habitsApi.create({
        name,
        description,
        frequency,
        targetDays: parseInt(targetDays),
      });

      Alert.alert('Success', 'Habit created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Habit</Text>
      </View>

      <Card>
        <Input
          placeholder="Habit Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
          placeholderTextColor={colors.textLight}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyButtons}>
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                frequency === freq && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  frequency === freq && styles.frequencyButtonTextActive,
                ]}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          placeholder="Target Days"
          value={targetDays}
          onChangeText={setTargetDays}
          keyboardType="numeric"
        />

        <Button
          title="Create Habit"
          onPress={handleCreate}
          loading={loading}
          disabled={loading}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginVertical: spacing.md,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    marginVertical: spacing.md,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
  },
  frequencyButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  frequencyButtonTextActive: {
    color: colors.surface,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default CreateHabitScreen;
