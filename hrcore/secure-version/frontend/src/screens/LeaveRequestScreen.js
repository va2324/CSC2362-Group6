import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { api } from '../api';

export default function LeaveRequestScreen({ navigation }) {
  const [type, setType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  async function submit() {
    try {
      const res = await api('/api/leave', {
        method: 'POST',
        body: JSON.stringify({
          type,
          start_date: startDate,
          end_date: endDate,
          notes: notes || null,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed');

      Alert.alert('Success', 'Leave request submitted');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.eyebrow}>HRCore</Text>
        <Text style={styles.title}>Submit Leave Request</Text>
        <Text style={styles.subtitle}>
          Create a new leave request and provide the details for review.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Request Details</Text>
        <Text style={styles.sectionDescription}>
          Fill out the fields below to submit your leave request.
        </Text>

        <View style={styles.fields}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Vacation"
            placeholderTextColor="#334155"
          />
        </View>

        <View style={styles.fields}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#334155"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fields}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#334155"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fields}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            placeholderTextColor="#334155"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={submit}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
    backgroundColor: '#090D14',
  },

  headerCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 28,
    marginBottom: 16,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E94560',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: -0.4,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
  },

  formCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: -0.2,
    marginBottom: 8,
  },

  sectionDescription: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 18,
  },

  fields: {
    gap: 8,
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },

  input: {
    backgroundColor: '#0C1018',
    color: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 15,
  },

  notes: {
    minHeight: 110,
  },

  primaryButton: {
    backgroundColor: '#E94560',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});