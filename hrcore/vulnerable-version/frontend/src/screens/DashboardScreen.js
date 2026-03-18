import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  const profileItems = [
    { label: 'Name', value: user?.name || '—' },
    { label: 'Email Address', value: user?.email || '—' },
    { label: 'Role', value: user?.role || '—' },
    { label: 'Department', value: user?.department || '—' },
    { label: 'Salary', value: user?.salary != null ? `$${user.salary}` : '—' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centerWrapper}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>HRCore</Text>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage your account, employee tools, and workspace actions from one place.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Overview</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user?.role || 'User'}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            {profileItems.map((item) => (
              <View key={item.label} style={styles.infoBlock}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Workspace Actions</Text>
          <Text style={styles.sectionDescription}>
            Quickly access the most common employee workflows.
          </Text>

          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Search Employees</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('LeaveRequest')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Submit Leave Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('MyLeaveRequests')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>My Leave Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('DocumentUpload')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Document Upload</Text>
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => navigation.navigate('AdminPanel')}
                activeOpacity={0.85}
              >
                <Text style={styles.adminButtonText}>Admin Panel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#090D14',
  },
  centerWrapper: {
    width: '100%',
  },
  heroCard: {
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
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
    padding: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 18,
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E94560',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  infoGrid: {
    gap: 16,
  },
  infoBlock: {
    backgroundColor: '#0C1018',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#F1F5F9',
    fontWeight: '500',
    lineHeight: 22,
  },
  actionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#E94560',
    flex: 1,
    minWidth: 220,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#141C2B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  secondaryButtonText: {
    color: '#F1F5F9',
    fontWeight: '600',
    fontSize: 15,
  },
  adminButton: {
    flex: 1,
    minWidth: 220,
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E94560',
  },
  adminButtonText: {
    color: '#E94560',
    fontWeight: '700',
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '600',
  },
});