import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>{user?.department || '—'}</Text>
        <Text style={styles.label}>Salary</Text>
        <Text style={styles.value}>{user?.salary != null ? `$${user.salary}` : '—'}</Text>
      </View>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.navButtonText}>Search Employees</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('LeaveRequest')}>
        <Text style={styles.navButtonText}>Submit Leave Request</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyLeaveRequests')}>
        <Text style={styles.navButtonText}>My Leave Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DocumentUpload')}>
        <Text style={styles.navButtonText}>Document Upload</Text>
      </TouchableOpacity>
      {user?.role === 'admin' && (
        <TouchableOpacity style={[styles.navButton, styles.adminButton]} onPress={() => navigation.navigate('AdminPanel')}>
          <Text style={styles.navButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  title: { fontSize: 24, color: '#eee', marginBottom: 16 },
  card: { backgroundColor: '#1a1a2e', padding: 16, borderRadius: 8, marginBottom: 20 },
  label: { color: '#888', fontSize: 12, marginTop: 8 },
  value: { color: '#fff', fontSize: 16, marginBottom: 4 },
  navButton: { backgroundColor: '#0f3460', padding: 14, borderRadius: 8, marginBottom: 10 },
  adminButton: { backgroundColor: '#e94560' },
  navButtonText: { color: '#fff', textAlign: 'center' },
  logoutButton: { marginTop: 24 },
  logoutText: { color: '#888', textAlign: 'center' },
});
