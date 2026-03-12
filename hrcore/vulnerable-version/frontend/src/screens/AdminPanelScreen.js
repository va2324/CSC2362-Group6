import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function AdminPanelScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api('/api/admin/all-employees');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      Alert.alert('Error', e.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function promote(id) {
    try {
      const res = await api(`/api/admin/promote/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ role: 'admin' }),
      });
      if (res.ok) load();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function remove(id) {
    Alert.alert('Delete', 'Remove this employee?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await api(`/api/admin/employee/${id}`, { method: 'DELETE' });
            if (res.ok) load();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  }

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#e94560" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin — All Employees</Text>
      <FlatList
        data={employees}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.email} · {item.role} · ${item.salary ?? '—'}</Text>
            </View>
            <View style={styles.actions}>
              {item.role !== 'admin' && (
                <TouchableOpacity style={styles.smallBtn} onPress={() => promote(item.id)}>
                  <Text style={styles.smallBtnText}>Promote</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.smallBtn, styles.dangerBtn]} onPress={() => remove(item.id)}>
                <Text style={styles.smallBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  title: { fontSize: 24, color: '#eee', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a2e', padding: 12, borderRadius: 8, marginBottom: 8 },
  rowLeft: { flex: 1 },
  name: { color: '#fff', fontWeight: '600' },
  meta: { color: '#888', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  smallBtn: { backgroundColor: '#0f3460', padding: 8, borderRadius: 6 },
  dangerBtn: { backgroundColor: '#e94560' },
  smallBtnText: { color: '#fff', fontSize: 12 },
});
