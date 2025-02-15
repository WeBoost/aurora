import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useServices } from '@/hooks/useServices';

const DURATIONS = [
  '30 minutes',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  'Full day',
  'Custom',
];

export default function ServicesPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const { services, loading: servicesLoading, createService, updateService, deleteService } = useServices(business?.id);
  const [isAddingService, setIsAddingService] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '1 hour',
    max_capacity: 1,
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      setFormError(null);

      if (!formData.name) {
        setFormError('Service name is required');
        return;
      }

      if (formData.price < 0) {
        setFormError('Price must be positive');
        return;
      }

      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }

      setIsAddingService(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: '1 hour',
        max_capacity: 1,
      });
    } catch (e) {
      setFormError('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (businessLoading || servicesLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="business" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Create Your Business First</Text>
          <Text style={styles.emptyStateDescription}>
            You need to create a business profile before adding services
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/business/edit')}>
            <Text style={styles.createButtonText}>Create Business Profile</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        {!isAddingService && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingService(true)}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>
        )}
      </View>

      {formError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      )}

      {isAddingService && (
        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingService ? 'Edit Service' : 'New Service'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsAddingService(false);
                setEditingService(null);
                setFormError(null);
              }}>
              <Ionicons name="close" size={24} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter service name"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your service"
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Price (ISK) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: parseFloat(text) || 0 })
                }
                placeholder="0"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Max Capacity</Text>
              <TextInput
                style={styles.input}
                value={formData.max_capacity.toString()}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    max_capacity: parseInt(text) || 1,
                  })
                }
                placeholder="1"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.durationList}>
              {DURATIONS.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    formData.duration === duration && styles.durationButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, duration })}>
                  <Text
                    style={[
                      styles.durationButtonText,
                      formData.duration === duration &&
                        styles.durationButtonTextActive,
                    ]}>
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsAddingService(false);
                setEditingService(null);
                setFormError(null);
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}>
              <Text style={styles.saveButtonText}>
                {saving
                  ? 'Saving...'
                  : editingService
                  ? 'Update Service'
                  : 'Add Service'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.servicesList}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>
                {service.description || 'No description provided'}
              </Text>
              <View style={styles.serviceDetails}>
                <View style={styles.serviceDetail}>
                  <Ionicons name="time" size={16} color="#A0AEC0" />
                  <Text style={styles.serviceDetailText}>
                    {service.duration}
                  </Text>
                </View>
                <View style={styles.serviceDetail}>
                  <Ionicons name="people" size={16} color="#A0AEC0" />
                  <Text style={styles.serviceDetailText}>
                    Max {service.max_capacity} {service.max_capacity === 1 ? 'person' : 'people'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.servicePrice}>
              <Text style={styles.servicePriceAmount}>
                {service.price.toLocaleString()} ISK
              </Text>
              <Text style={styles.servicePriceLabel}>per person</Text>
              <View style={styles.serviceActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingService(service);
                    setFormData({
                      name: service.name,
                      description: service.description || '',
                      price: service.price,
                      duration: service.duration,
                      max_capacity: service.max_capacity,
                    });
                    setIsAddingService(true);
                  }}>
                  <Ionicons name="create" size={20} color="#45B08C" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteService(service.id)}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {services.length === 0 && !isAddingService && (
          <View style={styles.emptyServices}>
            <Ionicons name="list" size={48} color="#45B08C" />
            <Text style={styles.emptyServicesTitle}>No Services Yet</Text>
            <Text style={styles.emptyServicesDescription}>
              Start by adding your first service to your business profile
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setIsAddingService(true)}>
              <Text style={styles.addFirstButtonText}>Add Your First Service</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  durationList: {
    marginHorizontal: -20,
  },
  durationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  durationButtonActive: {
    backgroundColor: '#45B08C',
  },
  durationButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  durationButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#45B08C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDetailText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  servicePrice: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  servicePriceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#45B08C',
  },
  servicePriceLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  emptyServices: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 32,
  },
  emptyServicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyServicesDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});