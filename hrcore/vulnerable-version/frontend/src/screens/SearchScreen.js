import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const res = await api(`/api/employees/search?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Employees</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={search} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Search</Text>}
      </TouchableOpacity>
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.name} — {item.email}</Text>
            <Text style={styles.rowSub}>{item.department || '—'} · ${item.salary ?? '—'}</Text>
          </View>
        )}
        ListEmptyComponent={results.length === 0 && !loading ? <Text style={styles.empty}>No results</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  title: { fontSize: 24, color: '#eee', marginBottom: 16 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#0f3460', padding: 14, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center' },
  row: { backgroundColor: '#1a1a2e', padding: 12, borderRadius: 8, marginBottom: 8 },
  rowText: { color: '#fff' },
  rowSub: { color: '#888', fontSize: 12, marginTop: 4 },
  empty: { color: '#888', textAlign: 'center', marginTop: 20 },
});
