import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

const Button = ({ onPress, title, disabled = false, loading = false, variant = 'primary', size = 'md' }) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    return variant === 'primary' ? colors.primary : colors.secondary;
  };

  const getSizeStyles = () => {
    return size === 'sm' 
      ? { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }
      : { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getSizeStyles(),
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const Input = ({ placeholder, value, onChangeText, secureTextEntry = false, error = null }) => {
  return (
    <View>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.textLight}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const Card = ({ children, style = {} }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const Badge = ({ text, variant = 'primary' }) => (
  <View style={[styles.badge, { backgroundColor: colors[variant] }]}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});

export { Button, Input, Card, Badge };
