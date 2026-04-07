import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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

  function renderEmployee({ item }) {
    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultName}>{item.name || '—'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.department || 'No Department'}</Text>
          </View>
        </View>

        <Text style={styles.resultEmail}>{item.email || '—'}</Text>

        <View style={styles.resultMetaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Role</Text>
            <Text style={styles.metaValue}>{item.role || '—'}</Text>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Salary</Text>
            <Text style={styles.metaValue}>
              {item.salary != null ? `$${item.salary}` : '—'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEmployee}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.content}>
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>HRCore</Text>
              <Text style={styles.title}>Search Employees</Text>
              <Text style={styles.subtitle}>
                Find team members by name and quickly review their employee details.
              </Text>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.sectionTitle}>Employee Lookup</Text>
              <Text style={styles.sectionDescription}>
                Search by employee name to view matching profiles.
              </Text>

              <View style={styles.searchRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter employee name"
                  value={query}
                  onChangeText={setQuery}
                  placeholderTextColor="#334155"
                  autoCapitalize="words"
                  returnKeyType="search"
                  onSubmitEditing={search}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={search}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Search</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Results</Text>
              <Text style={styles.resultsCount}>
                {loading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'}`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try another employee name to search the directory.
              </Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.resultSpacer} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090D14',
  },

  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
  },

  content: {
    width: '100%',
  },

  heroCard: {
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

  searchCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
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

  searchRow: {
    gap: 12,
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

  button: {
    backgroundColor: '#E94560',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },

  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: -0.2,
  },

  resultsCount: {
    fontSize: 13,
    color: '#94A3B8',
  },

  resultCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },

  resultName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#F1F5F9',
    lineHeight: 24,
  },

  badge: {
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E94560',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  resultEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 14,
  },

  resultMetaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
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

  resultSpacer: {
    height: 12,
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
});