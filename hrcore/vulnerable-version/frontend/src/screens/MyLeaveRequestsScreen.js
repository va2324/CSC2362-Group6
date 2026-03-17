import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api';

export default function MyLeaveRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api('/api/leave');
        if (res.ok) setRequests(await res.json());
      } catch (_) { }
      setLoading(false);
    })();
  }, []);

  function getStatusStyle(status) {
    switch (status) {
      case 'approved':
        return styles.statusSuccess;
      case 'pending':
        return styles.statusWarning;
      case 'rejected':
        return styles.statusDanger;
      default:
        return styles.statusNeutral;
    }
  }

  function renderRequest({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type}</Text>
          <View style={[styles.badge, getStatusStyle(item.status)]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Dates</Text>
          <Text style={styles.metaValue}>
            {item.start_date} — {item.end_date}
          </Text>
        </View>

        {item.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#E94560" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRequest}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>HRCore</Text>
            <Text style={styles.title}>My Leave Requests</Text>
            <Text style={styles.subtitle}>
              Track, review, and manage your submitted leave requests.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyText}>
              You haven’t submitted any leave requests.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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

  card: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  statusSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },

  statusWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },

  statusDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },

  statusNeutral: {
    backgroundColor: '#141C2B',
    borderColor: '#1E293B',
  },

  metaBlock: {
    backgroundColor: '#0C1018',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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

  notesBox: {
    backgroundColor: '#0C1018',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
  },

  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  notes: {
    fontSize: 14,
    color: '#F1F5F9',
    lineHeight: 20,
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
  },
});