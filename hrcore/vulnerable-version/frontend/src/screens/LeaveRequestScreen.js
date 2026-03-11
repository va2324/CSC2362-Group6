import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
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
        body: JSON.stringify({ type, start_date: startDate, end_date: endDate, notes: notes || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      Alert.alert('Success', 'Leave request submitted');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submit Leave Request</Text>
      <Text style={styles.label}>Type</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} placeholderTextColor="#888" />
      <Text style={styles.label}>Start date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="2025-01-01" placeholderTextColor="#888" />
      <Text style={styles.label}>End date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="2025-01-05" placeholderTextColor="#888" />
      <Text style={styles.label}>Notes (XSS payload can go here)</Text>
      <TextInput style={[styles.input, styles.notes]} value={notes} onChangeText={setNotes} placeholder="Optional notes" placeholderTextColor="#888" multiline />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#16213e' },
  title: { fontSize: 24, color: '#eee', marginBottom: 16 },
  label: { color: '#888', marginBottom: 4 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  notes: { minHeight: 80 },
  button: { backgroundColor: '#e94560', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
