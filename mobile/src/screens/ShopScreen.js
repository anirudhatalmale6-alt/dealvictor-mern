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

const ShopScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    { id: 1, name: 'Premium WordPress Theme', price: 59, originalPrice: 79, seller: 'ThemeForest', rating: 4.8, sales: 1234 },
    { id: 2, name: 'UI/UX Design Kit', price: 49, originalPrice: null, seller: 'DesignPro', rating: 4.9, sales: 567 },
    { id: 3, name: 'React Dashboard Template', price: 39, originalPrice: 59, seller: 'CodeCraft', rating: 4.7, sales: 890 },
    { id: 4, name: 'Icon Pack Bundle', price: 29, originalPrice: null, seller: 'IconMaster', rating: 5.0, sales: 2345 },
    { id: 5, name: 'Mobile App UI Kit', price: 79, originalPrice: 99, seller: 'AppDesigns', rating: 4.8, sales: 456 },
    { id: 6, name: 'Logo Template Pack', price: 19, originalPrice: 29, seller: 'LogoMakers', rating: 4.6, sales: 789 },
  ];

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <View style={styles.imagePlaceholder}>
          <Icon name="package" size={32} color={colors.lightGray} />
        </View>
        {item.originalPrice && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
      </View>
      <View style={styles.productContent}>
        <Text style={styles.productSeller}>{item.seller}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={12} color={colors.accent} />
          <Text style={styles.ratingValue}>{item.rating}</Text>
          <Text style={styles.salesCount}>({item.sales} sales)</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity>
          <Icon name="shopping-cart" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.dark },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16 },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: 12, fontSize: 16, color: colors.dark },
  productsList: { padding: 20, paddingTop: 0 },
  gridRow: { justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  productImage: { height: 120, backgroundColor: colors.lighterGray, position: 'relative' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saleBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.error, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  saleText: { fontSize: 10, fontWeight: '700', color: colors.white },
  productContent: { padding: 12 },
  productSeller: { fontSize: 11, color: colors.gray, marginBottom: 4 },
  productName: { fontSize: 13, fontWeight: '600', color: colors.dark, lineHeight: 18, marginBottom: 8, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingValue: { fontSize: 12, fontWeight: '600', color: colors.dark, marginLeft: 4 },
  salesCount: { fontSize: 11, color: colors.gray, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productPrice: { fontSize: 16, fontWeight: '700', color: colors.primary },
  originalPrice: { fontSize: 13, color: colors.gray, textDecorationLine: 'line-through' },
});

export default ShopScreen;
