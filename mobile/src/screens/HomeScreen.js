import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import colors from '../styles/colors';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Web Dev', icon: 'monitor', color: '#6366f1' },
    { id: 2, name: 'Design', icon: 'pen-tool', color: '#10b981' },
    { id: 3, name: 'Mobile', icon: 'smartphone', color: '#f59e0b' },
    { id: 4, name: 'Writing', icon: 'edit-3', color: '#ef4444' },
    { id: 5, name: 'Video', icon: 'video', color: '#8b5cf6' },
    { id: 6, name: 'More', icon: 'grid', color: '#64748b' },
  ];

  const featuredServices = [
    {
      id: 1,
      title: 'Professional Logo Design',
      seller: 'John D.',
      price: 50,
      rating: 4.9,
      reviews: 234,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      title: 'WordPress Website Development',
      seller: 'Sarah M.',
      price: 150,
      rating: 4.8,
      reviews: 189,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      title: 'Mobile App UI/UX Design',
      seller: 'Mike R.',
      price: 200,
      rating: 5.0,
      reviews: 156,
      image: 'https://via.placeholder.com/150'
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      budget: '$1,000 - $2,500',
      bids: 15,
      posted: '2 hours ago',
      skills: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Mobile App for Food Delivery',
      budget: '$2,000 - $5,000',
      bids: 23,
      posted: '4 hours ago',
      skills: ['React Native', 'Firebase']
    },
    {
      id: 3,
      title: 'Logo and Brand Identity Design',
      budget: '$200 - $500',
      bids: 34,
      posted: '6 hours ago',
      skills: ['Illustrator', 'Photoshop']
    },
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceImage}>
        <View style={styles.servicePlaceholder}>
          <Icon name="image" size={32} color={colors.lightGray} />
        </View>
      </View>
      <View style={styles.serviceContent}>
        <View style={styles.sellerRow}>
          <View style={styles.sellerAvatar}>
            <Text style={styles.sellerInitial}>{item.seller.charAt(0)}</Text>
          </View>
          <Text style={styles.sellerName}>{item.seller}</Text>
        </View>
        <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.serviceFooter}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
          <Text style={styles.servicePrice}>From ${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}
    >
      <Text style={styles.projectTitle}>{item.title}</Text>
      <View style={styles.projectMeta}>
        <Text style={styles.projectBudget}>{item.budget}</Text>
        <Text style={styles.projectBids}>{item.bids} bids</Text>
      </View>
      <View style={styles.skillsRow}>
        {item.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.projectPosted}>{item.posted}</Text>
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
            <View>
              <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
              <Text style={styles.subGreeting}>Find your next opportunity</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => navigation.navigate('Messages')}
            >
              <Icon name="bell" size={24} color={colors.white} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services, projects..."
              placeholderTextColor={colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Icon name="sliders" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionProjects]}
            onPress={() => navigation.navigate('Projects')}
          >
            <Icon name="briefcase" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Find Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionServices]}
            onPress={() => navigation.navigate('Services')}
          >
            <Icon name="star" size={24} color={colors.secondary} />
            <Text style={styles.actionLabel}>Browse Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionShop]}
            onPress={() => navigation.navigate('Shop')}
          >
            <Icon name="shopping-bag" size={24} color={colors.accent} />
            <Text style={styles.actionLabel}>Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredServices}
            renderItem={renderService}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Projects</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentProjects.map(project => (
            <View key={project.id}>
              {renderProject({ item: project })}
            </View>
          ))}
        </View>

        {/* Upgrade Banner */}
        <TouchableOpacity
          style={styles.upgradeBanner}
          onPress={() => navigation.navigate('Membership')}
        >
          <LinearGradient
            colors={colors.gradient.accent}
            style={styles.upgradeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.upgradeContent}>
              <Icon name="crown" size={28} color={colors.white} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                <Text style={styles.upgradeDesc}>Get unlimited bids & premium features</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: colors.lighterGray,
    borderRadius: 8,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 8,
    textAlign: 'center',
  },
  servicesList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  serviceCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceImage: {
    height: 120,
    backgroundColor: colors.lighterGray,
  },
  servicePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceContent: {
    padding: 12,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sellerInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  sellerName: {
    fontSize: 12,
    color: colors.gray,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  projectBudget: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  projectBids: {
    fontSize: 14,
    color: colors.gray,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    color: colors.gray,
  },
  projectPosted: {
    fontSize: 12,
    color: colors.gray,
  },
  upgradeBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeText: {
    marginLeft: 16,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  upgradeDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});

export default HomeScreen;
