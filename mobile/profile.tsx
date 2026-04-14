import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import AppButton from '../../components/AppButton';
import { apiCall } from '../../services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/auth/profile');
      setUserDetails(data.user || data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const displayUser = userDetails || user;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{displayUser?.name || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{displayUser?.email || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Role</Text>
              <View
                style={[
                  styles.roleBadge,
                  displayUser?.role === 'admin' ? styles.role_admin 
                  : displayUser?.role === 'staff' ? styles.role_staff 
                  : styles.role_customer,
                ]}
              >
                <Text style={styles.roleBadgeText}>
                  {displayUser?.role?.toUpperCase() || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Member Since</Text>
            <Text style={styles.statsValue}>
              {displayUser?.createdAt
                ? new Date(displayUser.createdAt).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <AppButton
            title="Refresh Profile"
            onPress={loadUserProfile}
            variant="secondary"
            size="medium"
          />
          <AppButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="medium"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    fontSize: 64,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  role_admin: {
    backgroundColor: '#FFE5E5',
  },
  role_staff: {
    backgroundColor: '#E5F2FF',
  },
  role_customer: {
    backgroundColor: '#E5FFE5',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  statsLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
});
