import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';

const MembershipScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('annual');

  const plans = [
    { id: 'free', name: 'Free', monthly: 0, annual: 0, bids: 10, fee: '10%', features: ['10 Bids/Month', 'Basic Support', '10% Platform Fee'] },
    { id: 'starter', name: 'Starter', monthly: 19, annual: 149, bids: 50, fee: '7%', features: ['50 Bids/Month', 'Priority Support', '7% Platform Fee', 'Featured Badge'] },
    { id: 'pro', name: 'Pro', monthly: 49, annual: 399, bids: 150, fee: '5%', popular: true, features: ['150 Bids/Month', '24/7 Support', '5% Platform Fee', 'Top Ranking', 'Analytics'] },
    { id: 'business', name: 'Business', monthly: 99, annual: 799, bids: 'Unlimited', fee: '3%', features: ['Unlimited Bids', 'Dedicated Manager', '3% Platform Fee', 'Premium Badge', 'API Access'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradient.primary} style={styles.heroSection}>
          <Icon name="crown" size={40} color={colors.accent} />
          <Text style={styles.heroTitle}>Choose Your Plan</Text>
          <Text style={styles.heroSubtitle}>Unlock premium features and grow your business</Text>

          <View style={styles.billingToggle}>
            <TouchableOpacity style={[styles.toggleBtn, billingCycle === 'monthly' && styles.toggleActive]} onPress={() => setBillingCycle('monthly')}>
              <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, billingCycle === 'annual' && styles.toggleActive]} onPress={() => setBillingCycle('annual')}>
              <Text style={[styles.toggleText, billingCycle === 'annual' && styles.toggleTextActive]}>Annual</Text>
              <View style={styles.saveBadge}><Text style={styles.saveText}>Save 20%</Text></View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected, plan.popular && styles.planCardPopular]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>MOST POPULAR</Text></View>}
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>{billingCycle === 'annual' ? plan.annual : plan.monthly}</Text>
                <Text style={styles.period}>/{billingCycle === 'annual' ? 'year' : 'month'}</Text>
              </View>
              <View style={styles.bidsBadge}>
                <Icon name="file-text" size={16} color={colors.primary} />
                <Text style={styles.bidsText}>{plan.bids} bids/month</Text>
              </View>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Icon name="check" size={16} color={colors.secondary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity style={[styles.selectBtn, selectedPlan === plan.id && styles.selectBtnActive]}>
                <Text style={[styles.selectBtnText, selectedPlan === plan.id && styles.selectBtnTextActive]}>
                  {plan.id === 'free' ? 'Current Plan' : 'Select Plan'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.dark },
  heroSection: { padding: 24, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: colors.white, marginTop: 12 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  billingToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 4, marginTop: 20 },
  toggleBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleActive: { backgroundColor: colors.white },
  toggleText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  toggleTextActive: { color: colors.primary },
  saveBadge: { backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveText: { fontSize: 10, fontWeight: '700', color: colors.white },
  plansContainer: { padding: 20 },
  planCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: 'transparent' },
  planCardSelected: { borderColor: colors.primary },
  planCardPopular: { borderColor: colors.accent },
  popularBadge: { position: 'absolute', top: -10, left: '50%', transform: [{ translateX: -50 }], backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { fontSize: 10, fontWeight: '700', color: colors.white },
  planName: { fontSize: 18, fontWeight: '700', color: colors.dark, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  currency: { fontSize: 20, fontWeight: '600', color: colors.dark },
  price: { fontSize: 36, fontWeight: '800', color: colors.dark },
  period: { fontSize: 14, color: colors.gray, marginLeft: 4 },
  bidsBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.lighterGray, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: 16 },
  bidsText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  featureText: { fontSize: 14, color: colors.gray },
  selectBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.lighterGray, alignItems: 'center' },
  selectBtnActive: { backgroundColor: colors.primary },
  selectBtnText: { fontSize: 15, fontWeight: '600', color: colors.gray },
  selectBtnTextActive: { color: colors.white },
});

export default MembershipScreen;
