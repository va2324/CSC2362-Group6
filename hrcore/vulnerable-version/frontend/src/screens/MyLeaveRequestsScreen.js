/**
 * VULNERABLE: Notes rendered without sanitization (Stored XSS - Vuln #3).
 * In a web build or if notes were rendered in a WebView with innerHTML, script in notes would execute.
 * For React Native we display raw text; for PoC use the web viewer at /leave-view.html served by backend.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function MyLeaveRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api('/api/leave');
        if (res.ok) setRequests(await res.json());
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#e94560" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Leave Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.dates}>{item.start_date} — {item.end_date}</Text>
            <Text style={styles.status}>{item.status}</Text>
            {/* Notes displayed as raw text; in web version this would be innerHTML = notes (XSS) */}
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
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
  card: { backgroundColor: '#1a1a2e', padding: 12, borderRadius: 8, marginBottom: 8 },
  type: { color: '#fff', fontWeight: '600' },
  dates: { color: '#888', fontSize: 12 },
  status: { color: '#e94560', fontSize: 12, marginTop: 4 },
  notes: { color: '#ccc', marginTop: 8 },
});
