import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
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

  function renderEmployee({ item }) {
    return (
      <View style={styles.employeeCard}>
        <View style={styles.employeeHeader}>
          <View style={styles.employeeHeaderLeft}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>

          <View
            style={[
              styles.badge,
              item.role === 'admin' ? styles.badgeAccent : styles.badgeNeutral,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                item.role === 'admin' ? styles.badgeTextAccent : styles.badgeTextNeutral,
              ]}
            >
              {item.role || 'user'}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Salary</Text>
            <Text style={styles.metaValue}>{item.salary != null ? `$${item.salary}` : '—'}</Text>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Employee ID</Text>
            <Text style={styles.metaValue}>{item.id}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {item.role !== 'admin' && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => promote(item.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Promote</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => remove(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.dangerButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E94560" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={employees}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEmployee}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>HRCore</Text>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>
              Manage employee accounts, promote users, and remove records from the system.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No employees found</Text>
            <Text style={styles.emptyText}>
              There are currently no employee records available.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.spacer} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090D14',
  },

  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  employeeCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
  },

  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },

  employeeHeaderLeft: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F1F5F9',
    lineHeight: 24,
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },

  badgeAccent: {
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },

  badgeNeutral: {
    backgroundColor: '#141C2B',
    borderColor: '#1E293B',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  badgeTextAccent: {
    color: '#E94560',
  },

  badgeTextNeutral: {
    color: '#94A3B8',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },

  metaBlock: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#0C1018',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },

  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  metaValue: {
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  secondaryButton: {
    backgroundColor: '#141C2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  secondaryButtonText: {
    color: '#F1F5F9',
    fontWeight: '600',
    fontSize: 14,
  },

  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  dangerButtonText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },

  emptyCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 21,
  },

  spacer: {
    height: 12,
  },
});