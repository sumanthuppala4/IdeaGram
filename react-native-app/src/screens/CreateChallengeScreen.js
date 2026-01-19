import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { challengesApi } from '../utils/api';
import { Button, Input, Card } from '../components/UI';
import { colors, spacing } from '../styles/theme';

const CreateChallengeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fitness');
  const [duration, setDuration] = useState('30');
  const [reward, setReward] = useState('100');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCreate = async () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Challenge name is required';
    if (!description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await challengesApi.create({
        name,
        description,
        category,
        duration: parseInt(duration),
        reward: parseInt(reward),
      });

      Alert.alert('Success', 'Challenge created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Challenge</Text>
      </View>

      <Card>
        <Input
          placeholder="Challenge Name"
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

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryButtons}>
          {['fitness', 'health', 'productivity', 'learning'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive,
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          placeholder="Duration (days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <Input
          placeholder="Reward Points"
          value={reward}
          onChangeText={setReward}
          keyboardType="numeric"
        />

        <Button
          title="Create Challenge"
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
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 12,
  },
  categoryButtonTextActive: {
    color: colors.surface,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default CreateChallengeScreen;
