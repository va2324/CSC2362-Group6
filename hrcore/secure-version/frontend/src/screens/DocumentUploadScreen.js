import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { api } from '../api';

export default function DocumentUploadScreen({ navigation }) {
  const [filename, setFilename] = useState('');
  const [filepath, setFilepath] = useState('');
  const [docs, setDocs] = useState([]);

  async function loadDocs() {
    try {
      const res = await api('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (_) { }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function upload() {
    if (!filename.trim() || !filepath.trim()) {
      Alert.alert('Error', 'Filename and filepath required');
      return;
    }

    try {
      const res = await api('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          filename: filename.trim(),
          filepath: filepath.trim(),
        }),
      });

      if (!res.ok) throw new Error('Upload failed');

      setFilename('');
      setFilepath('');
      loadDocs();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  function renderDocument({ item }) {
    return (
      <View style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentName}>{item.filename}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Document</Text>
          </View>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Uploaded At</Text>
          <Text style={styles.metaValue}>{item.uploaded_at || '—'}</Text>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Path</Text>
          <Text style={styles.metaValue}>{item.filepath || '—'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={docs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDocument}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text style={styles.eyebrow}>HRCore</Text>
              <Text style={styles.title}>Document Upload</Text>
              <Text style={styles.subtitle}>
                Add and manage employee documents in one centralized workspace.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Add Document</Text>
              <Text style={styles.sectionDescription}>
                Enter the document details below to add a new file record.
              </Text>

              <View style={styles.fields}>
                <Text style={styles.label}>Filename</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter filename"
                  value={filename}
                  onChangeText={setFilename}
                  placeholderTextColor="#334155"
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.label}>File Path</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. uploads/doc.pdf"
                  value={filepath}
                  onChangeText={setFilepath}
                  placeholderTextColor="#334155"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={upload}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Add Document</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>My Documents</Text>
              <Text style={styles.resultsCount}>
                {docs.length} document{docs.length === 1 ? '' : 's'}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptyText}>
              Add your first document to start building your file library.
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

  documentCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
  },

  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },

  documentName: {
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

  metaBlock: {
    backgroundColor: '#0C1018',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
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
    lineHeight: 21,
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