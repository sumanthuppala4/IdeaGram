import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-toast-notifications';
import { useToast } from 'react-native-toast-notifications';

const NotificationToast = ({ message, type = 'success' }) => {
  const toast = useToast();

  useEffect(() => {
    if (message) {
      toast.show(message, {
        type,
        placement: 'top',
        duration: 3000,
        offsetTop: 30,
        animationType: 'zoom-in',
      });
    }
  }, [message, type, toast]);

  return null;
};

export default NotificationToast;
