import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';

const ProjectDetailScreen = ({ navigation, route }) => {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [proposal, setProposal] = useState('');

  const project = {
    id: route.params?.id || 1,
    title: 'E-commerce Website Development with React & Node.js',
    description: `We are looking for an experienced full-stack developer to build a complete e-commerce platform for our online retail business.

The project includes:
- Product catalog with categories and filtering
- Shopping cart and checkout functionality
- User authentication and profiles
- Payment integration (Stripe)
- Order management system
- Admin dashboard
- Mobile responsive design

We prefer developers with prior e-commerce experience and strong portfolio.`,
    budget: { min: 1000, max: 2500, type: 'fixed' },
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express'],
    bidsCount: 15,
    postedAt: '2 hours ago',
    deadline: '30 days',
    client: {
      name: 'TechCorp Industries',
      verified: true,
      rating: 4.8,
      reviews: 23,
      projectsPosted: 45,
      memberSince: 'Jan 2022',
      country: 'United States'
    }
  };

  const handleSubmitBid = () => {
    if (!bidAmount || !deliveryDays || !proposal) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setShowBidModal(false);
    Alert.alert('Success', 'Your bid has been submitted successfully!');
    setBidAmount('');
    setDeliveryDays('');
    setProposal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-2" size={20} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Project Info */}
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={colors.gray} />
              <Text style={styles.metaText}>{project.postedAt}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="file-text" size={16} color={colors.gray} />
              <Text style={styles.metaText}>{project.bidsCount} bids</Text>
            </View>
          </View>
        </View>

        {/* Budget Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetMain}>
            <Text style={styles.budgetLabel}>Project Budget</Text>
            <Text style={styles.budgetValue}>
              ${project.budget.min} - ${project.budget.max}
            </Text>
            <Text style={styles.budgetType}>
              {project.budget.type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
            </Text>
          </View>
          <View style={styles.budgetDivider} />
          <View style={styles.budgetSide}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.deadlineText}>{project.deadline}</Text>
            <Text style={styles.deadlineLabel}>Deadline</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Required</Text>
          <View style={styles.skillsContainer}>
            {project.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Client</Text>
          <View style={styles.clientCard}>
            <View style={styles.clientHeader}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientInitial}>
                  {project.client.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.clientDetails}>
                <View style={styles.clientNameRow}>
                  <Text style={styles.clientName}>{project.client.name}</Text>
                  {project.client.verified && (
                    <Icon name="check-circle" size={16} color={colors.info} />
                  )}
                </View>
                <View style={styles.clientLocation}>
                  <Icon name="map-pin" size={14} color={colors.gray} />
                  <Text style={styles.locationText}>{project.client.country}</Text>
                </View>
              </View>
            </View>

            <View style={styles.clientStats}>
              <View style={styles.clientStat}>
                <View style={styles.statRow}>
                  <Icon name="star" size={16} color={colors.accent} />
                  <Text style={styles.statValue}>{project.client.rating}</Text>
                </View>
                <Text style={styles.statLabel}>{project.client.reviews} reviews</Text>
              </View>
              <View style={styles.clientStat}>
                <Text style={styles.statValue}>{project.client.projectsPosted}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.clientStat}>
                <Text style={styles.statValue}>{project.client.memberSince}</Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => navigation.navigate('Chat', { projectId: project.id })}
        >
          <Icon name="message-circle" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bidButton}
          onPress={() => setShowBidModal(true)}
        >
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.bidButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="send" size={20} color={colors.white} />
            <Text style={styles.bidButtonText}>Place a Bid</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bid Modal */}
      <Modal
        visible={showBidModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Your Bid</Text>
              <TouchableOpacity onPress={() => setShowBidModal(false)}>
                <Icon name="x" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bid Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your bid amount"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Delivery Time (Days)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="How many days to complete?"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                  value={deliveryDays}
                  onChangeText={setDeliveryDays}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cover Letter</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Describe why you're the best fit for this project..."
                  placeholderTextColor={colors.gray}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={proposal}
                  onChangeText={setProposal}
                />
              </View>

              <View style={styles.bidSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Your Bid</Text>
                  <Text style={styles.summaryValue}>${bidAmount || '0'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Platform Fee (10%)</Text>
                  <Text style={styles.summaryValue}>
                    -${((parseFloat(bidAmount) || 0) * 0.1).toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.totalLabel}>You'll Receive</Text>
                  <Text style={styles.totalValue}>
                    ${((parseFloat(bidAmount) || 0) * 0.9).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBidButton}
                onPress={handleSubmitBid}
              >
                <Text style={styles.submitBidText}>Submit Bid</Text>
              </TouchableOpacity>

              <Text style={styles.bidNote}>
                This will use 1 bid from your account. You have 15 bids remaining.
              </Text>
            </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  shareButton: {
    padding: 4,
  },
  projectInfo: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    lineHeight: 28,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.gray,
  },
  budgetCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetMain: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 4,
  },
  budgetType: {
    fontSize: 14,
    color: colors.gray,
  },
  budgetDivider: {
    width: 1,
    backgroundColor: colors.lighterGray,
    marginHorizontal: 20,
  },
  budgetSide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlineText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 8,
  },
  deadlineLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  clientCard: {
    backgroundColor: colors.lighterGray,
    borderRadius: 12,
    padding: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  clientDetails: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  clientLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.gray,
  },
  clientStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  clientStat: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  bottomAction: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
    gap: 12,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.lighterGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bidButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  bidButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
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
    maxHeight: '90%',
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
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.lighterGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  bidSummary: {
    backgroundColor: colors.lighterGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  summaryTotal: {
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
  },
  submitBidButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBidText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  bidNote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default ProjectDetailScreen;
