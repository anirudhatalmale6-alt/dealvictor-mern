import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import colors from '../styles/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const stats = {
    earnings: 12450,
    projects: 47,
    rating: 4.9,
    reviews: 234
  };

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'user', label: 'Edit Profile', screen: 'EditProfile' },
        { icon: 'briefcase', label: 'My Projects', screen: 'Dashboard' },
        { icon: 'star', label: 'My Services', screen: 'MyServices' },
        { icon: 'shopping-bag', label: 'My Products', screen: 'MyProducts' },
      ]
    },
    {
      section: 'Finances',
      items: [
        { icon: 'dollar-sign', label: 'Earnings', screen: 'Earnings' },
        { icon: 'credit-card', label: 'Payment Methods', screen: 'PaymentMethods' },
        { icon: 'file-text', label: 'Invoices', screen: 'Invoices' },
      ]
    },
    {
      section: 'Membership',
      items: [
        { icon: 'crown', label: 'Upgrade Plan', screen: 'Membership', accent: true },
        { icon: 'package', label: 'Buy Bids', screen: 'BuyBids' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { icon: 'bell', label: 'Notifications', screen: 'Notifications' },
        { icon: 'lock', label: 'Security', screen: 'Security' },
        { icon: 'help-circle', label: 'Help & Support', screen: 'Support' },
      ]
    }
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.label}
      style={[styles.menuItem, item.accent && styles.menuItemAccent]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={[styles.menuIcon, item.accent && styles.menuIconAccent]}>
        <Icon name={item.icon} size={20} color={item.accent ? colors.accent : colors.gray} />
      </View>
      <Text style={[styles.menuLabel, item.accent && styles.menuLabelAccent]}>
        {item.label}
      </Text>
      <Icon name="chevron-right" size={20} color={colors.lightGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={colors.gradient.primary}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon name="settings" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Freelancer'}</Text>

            <View style={styles.membershipBadge}>
              <Icon name="crown" size={14} color={colors.accent} />
              <Text style={styles.membershipText}>Free Plan</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.earnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.projects}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color={colors.accent} />
                <Text style={styles.statValue}>{stats.rating}</Text>
              </View>
              <Text style={styles.statLabel}>{stats.reviews} reviews</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Bids Status */}
        <View style={styles.bidsCard}>
          <View style={styles.bidsInfo}>
            <Icon name="file-text" size={24} color={colors.primary} />
            <View style={styles.bidsText}>
              <Text style={styles.bidsTitle}>Bids Remaining</Text>
              <Text style={styles.bidsCount}>15 / 20 bids</Text>
            </View>
          </View>
          <View style={styles.bidsProgress}>
            <View style={[styles.bidsProgressFill, { width: '75%' }]} />
          </View>
          <TouchableOpacity style={styles.buyBidsButton}>
            <Text style={styles.buyBidsText}>Buy More</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuItems.map(section => (
          <View key={section.section} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DealVictor v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  settingsButton: {
    padding: 4,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  membershipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bidsCard: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: -16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bidsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bidsText: {
    marginLeft: 12,
    flex: 1,
  },
  bidsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  bidsCount: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  bidsProgress: {
    height: 6,
    backgroundColor: colors.lighterGray,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bidsProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  buyBidsButton: {
    backgroundColor: colors.lighterGray,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyBidsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  menuItemAccent: {
    backgroundColor: colors.accent + '08',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.lighterGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconAccent: {
    backgroundColor: colors.accent + '15',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  menuLabelAccent: {
    color: colors.accent,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.error + '10',
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.gray,
    marginBottom: 30,
  },
});

export default ProfileScreen;
