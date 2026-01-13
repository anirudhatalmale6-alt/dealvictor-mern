import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

const ServicesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'graphics', name: 'Graphics & Design' },
    { id: 'digital', name: 'Digital Marketing' },
    { id: 'writing', name: 'Writing' },
    { id: 'video', name: 'Video & Animation' },
    { id: 'programming', name: 'Programming' },
  ];

  const services = [
    {
      id: 1,
      title: 'I will design a modern and professional logo for your business',
      seller: { name: 'John Designer', level: 'Top Rated', rating: 4.9, reviews: 234 },
      price: 50,
      deliveryDays: 3,
      orders: 127,
      image: null
    },
    {
      id: 2,
      title: 'I will develop a responsive WordPress website',
      seller: { name: 'Sarah Dev', level: 'Pro', rating: 5.0, reviews: 189 },
      price: 200,
      deliveryDays: 7,
      orders: 89,
      image: null
    },
    {
      id: 3,
      title: 'I will create engaging social media content and graphics',
      seller: { name: 'Mike Creative', level: 'Verified', rating: 4.8, reviews: 156 },
      price: 75,
      deliveryDays: 2,
      orders: 312,
      image: null
    },
    {
      id: 4,
      title: 'I will write SEO-optimized blog posts and articles',
      seller: { name: 'Emily Writer', level: 'Top Rated', rating: 4.9, reviews: 412 },
      price: 40,
      deliveryDays: 2,
      orders: 567,
      image: null
    },
    {
      id: 5,
      title: 'I will create professional video editing and motion graphics',
      seller: { name: 'Alex Video', level: 'Pro', rating: 4.7, reviews: 98 },
      price: 150,
      deliveryDays: 5,
      orders: 45,
      image: null
    },
  ];

  const getLevelStyle = (level) => {
    switch (level) {
      case 'Top Rated':
        return { bg: colors.accent + '20', color: colors.accent };
      case 'Pro':
        return { bg: colors.primary + '20', color: colors.primary };
      case 'Verified':
        return { bg: colors.secondary + '20', color: colors.secondary };
      default:
        return { bg: colors.gray + '20', color: colors.gray };
    }
  };

  const renderService = ({ item }) => {
    const levelStyle = getLevelStyle(item.seller.level);

    return (
      <TouchableOpacity style={styles.serviceCard}>
        <View style={styles.serviceImage}>
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={32} color={colors.lightGray} />
          </View>
          <TouchableOpacity style={styles.wishlistBtn}>
            <Icon name="heart" size={18} color={colors.gray} />
          </TouchableOpacity>
          <View style={styles.queueBadge}>
            <Icon name="clock" size={12} color={colors.white} />
            <Text style={styles.queueText}>{item.orders} in queue</Text>
          </View>
        </View>

        <View style={styles.serviceContent}>
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>
                {item.seller.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{item.seller.name}</Text>
              <View style={[
                styles.levelBadge,
                { backgroundColor: levelStyle.bg }
              ]}>
                <Text style={[styles.levelText, { color: levelStyle.color }]}>
                  {item.seller.level}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.serviceTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingValue}>{item.seller.rating}</Text>
            <Text style={styles.reviewCount}>({item.seller.reviews})</Text>
          </View>

          <View style={styles.serviceFooter}>
            <View style={styles.deliveryInfo}>
              <Icon name="clock" size={14} color={colors.gray} />
              <Text style={styles.deliveryText}>{item.deliveryDays} days</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.priceValue}>${item.price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="sliders" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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

      {/* Services Grid */}
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
      />
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
  servicesList: {
    padding: 20,
    paddingTop: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceImage: {
    height: 120,
    backgroundColor: colors.lighterGray,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  queueBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  queueText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '500',
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '600',
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.dark,
    lineHeight: 18,
    marginBottom: 8,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingValue: {
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
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 11,
    color: colors.gray,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
});

export default ServicesScreen;
