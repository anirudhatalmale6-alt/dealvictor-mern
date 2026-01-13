import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

const ProjectsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'design', name: 'Design' },
    { id: 'writing', name: 'Writing' },
    { id: 'marketing', name: 'Marketing' },
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Website Development with React & Node.js',
      description: 'Looking for an experienced developer to build a complete e-commerce platform...',
      budget: { min: 1000, max: 2500, type: 'fixed' },
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      bidsCount: 15,
      postedAt: '2 hours ago',
      client: { name: 'TechCorp', verified: true, rating: 4.8 }
    },
    {
      id: 2,
      title: 'iOS and Android App for Food Delivery Service',
      description: 'Need a cross-platform mobile application for food delivery with real-time tracking...',
      budget: { min: 2000, max: 5000, type: 'fixed' },
      skills: ['React Native', 'Firebase', 'Google Maps API'],
      bidsCount: 23,
      postedAt: '4 hours ago',
      client: { name: 'FoodieApp', verified: true, rating: 4.9 }
    },
    {
      id: 3,
      title: 'Logo and Complete Brand Identity Design',
      description: 'We need a modern logo and full brand identity package including business cards...',
      budget: { min: 200, max: 500, type: 'fixed' },
      skills: ['Logo Design', 'Illustrator', 'Photoshop'],
      bidsCount: 34,
      postedAt: '6 hours ago',
      client: { name: 'StartupX', verified: false, rating: 4.5 }
    },
    {
      id: 4,
      title: 'SEO Optimization for WordPress Website',
      description: 'Need an SEO expert to optimize our existing WordPress site for better rankings...',
      budget: { min: 30, max: 50, type: 'hourly' },
      skills: ['SEO', 'WordPress', 'Google Analytics'],
      bidsCount: 18,
      postedAt: '8 hours ago',
      client: { name: 'LocalBiz', verified: true, rating: 4.7 }
    },
    {
      id: 5,
      title: 'Video Editing for YouTube Channel',
      description: 'Looking for a skilled video editor for ongoing YouTube content...',
      budget: { min: 100, max: 300, type: 'fixed' },
      skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
      bidsCount: 28,
      postedAt: '12 hours ago',
      client: { name: 'ContentCreator', verified: true, rating: 4.6 }
    },
  ];

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}
    >
      <View style={styles.projectHeader}>
        <View style={styles.clientInfo}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>{item.client.name.charAt(0)}</Text>
          </View>
          <View>
            <View style={styles.clientNameRow}>
              <Text style={styles.clientName}>{item.client.name}</Text>
              {item.client.verified && (
                <Icon name="check-circle" size={14} color={colors.info} />
              )}
            </View>
            <View style={styles.ratingRow}>
              <Icon name="star" size={12} color={colors.accent} />
              <Text style={styles.ratingText}>{item.client.rating}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.postedTime}>{item.postedAt}</Text>
      </View>

      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text style={styles.projectDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.skillsRow}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>+{item.skills.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.projectFooter}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>
            {item.budget.type === 'fixed' ? 'Fixed Price' : 'Hourly'}
          </Text>
          <Text style={styles.budgetValue}>
            ${item.budget.min} - ${item.budget.max}
          </Text>
        </View>
        <View style={styles.bidsContainer}>
          <Icon name="file-text" size={16} color={colors.primary} />
          <Text style={styles.bidsCount}>{item.bidsCount} bids</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Projects</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Icon name="sliders" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="x" size={20} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === item.id && styles.categoryChipTextActive
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Projects List */}
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.projectsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="x" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Budget Range</Text>
              <View style={styles.budgetInputs}>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="Min"
                  keyboardType="numeric"
                />
                <Text style={styles.budgetDash}>-</Text>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="Max"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Project Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity style={[styles.typeButton, styles.typeButtonActive]}>
                  <Text style={styles.typeButtonTextActive}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.typeButton}>
                  <Text style={styles.typeButtonText}>Fixed Price</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.typeButton}>
                  <Text style={styles.typeButtonText}>Hourly</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  projectsList: {
    padding: 20,
    paddingTop: 16,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  postedTime: {
    fontSize: 12,
    color: colors.gray,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    lineHeight: 22,
  },
  projectDescription: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
  },
  budgetContainer: {},
  budgetLabel: {
    fontSize: 11,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  bidsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  budgetInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  budgetDash: {
    marginHorizontal: 12,
    color: colors.gray,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.lighterGray,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  typeButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default ProjectsScreen;
