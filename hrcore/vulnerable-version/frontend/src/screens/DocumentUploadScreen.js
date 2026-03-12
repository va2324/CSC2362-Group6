import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
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
    } catch (_) {}
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
        body: JSON.stringify({ filename: filename.trim(), filepath: filepath.trim() }),
      });
      if (!res.ok) throw new Error('Upload failed');
      setFilename('');
      setFilepath('');
      loadDocs();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Upload</Text>
      <TextInput style={styles.input} placeholder="Filename" value={filename} onChangeText={setFilename} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="File path (e.g. /uploads/doc.pdf)" value={filepath} onChangeText={setFilepath} placeholderTextColor="#888" />
      <TouchableOpacity style={styles.button} onPress={upload}>
        <Text style={styles.buttonText}>Add Document</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>My documents</Text>
      <FlatList
        data={docs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.filename}</Text>
            <Text style={styles.rowSub}>{item.uploaded_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  title: { fontSize: 24, color: '#eee', marginBottom: 16 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e94560', padding: 14, borderRadius: 8, marginBottom: 24 },
  buttonText: { color: '#fff', textAlign: 'center' },
  subtitle: { color: '#888', marginBottom: 8 },
  row: { backgroundColor: '#1a1a2e', padding: 12, borderRadius: 8, marginBottom: 8 },
  rowText: { color: '#fff' },
  rowSub: { color: '#888', fontSize: 12, marginTop: 4 },
});
