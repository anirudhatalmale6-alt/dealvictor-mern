import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import colors from '../styles/colors';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const stats = { earnings: 12450, projects: 47, pendingBids: 8, successRate: 33 };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.statsGrid}>
          {[
            { label: 'Earnings', value: `$${stats.earnings.toLocaleString()}`, icon: 'dollar-sign', color: colors.secondary },
            { label: 'Projects', value: stats.projects, icon: 'briefcase', color: colors.primary },
            { label: 'Pending Bids', value: stats.pendingBids, icon: 'clock', color: colors.accent },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: 'trending-up', color: colors.info }
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'briefcase', label: 'My Projects', color: colors.primary },
              { icon: 'star', label: 'My Services', color: colors.secondary },
              { icon: 'file-text', label: 'My Bids', color: colors.accent },
              { icon: 'message-square', label: 'Messages', color: colors.info }
            ].map((action, i) => (
              <TouchableOpacity key={i} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Icon name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.upgradeCard}>
          <LinearGradient colors={colors.gradient.accent} style={styles.upgradeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Icon name="crown" size={28} color={colors.white} />
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeDesc}>Get unlimited bids & lower fees</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.dark },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  statCard: { width: '47%', backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 4 },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.dark },
  statLabel: { fontSize: 13, color: colors.gray, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark, marginBottom: 16 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '47%', backgroundColor: colors.white, borderRadius: 16, padding: 16, alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 14, fontWeight: '600', color: colors.dark },
  upgradeCard: { margin: 20, borderRadius: 16, overflow: 'hidden' },
  upgradeGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  upgradeText: { flex: 1 },
  upgradeTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  upgradeDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
});

export default DashboardScreen;
