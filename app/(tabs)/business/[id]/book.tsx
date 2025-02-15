import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../../../hooks/useAuth';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useServices } from '../../../../hooks/useServices';
import { useBookingSlots } from '../../../../hooks/useBookingSlots';
import { supabase } from '../../../../lib/supabase';

const STEPS = [
  { id: 'service', title: 'Choose Service' },
  { id: 'datetime', title: 'Select Date & Time' },
  { id: 'details', title: 'Your Details' },
  { id: 'confirm', title: 'Confirm Booking' },
];

export default function BookingPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(params.id);
  const { services, loading: servicesLoading } = useServices(params.id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: '1',
    specialRequests: '',
  });
  const [booking, setBooking] = useState(false);

  const { slots, loading: slotsLoading } = useBookingSlots(
    params.id,
    selectedService?.id,
    selectedDate.toISOString().split('T')[0]
  );

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedTime || !business) return;

    try {
      setBooking(true);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          business_id: business.id,
          service_id: selectedService.id,
          customer_id: session?.user?.id,
          booking_date: selectedDate.toISOString().split('T')[0],
          start_time: selectedTime,
          end_time: calculateEndTime(selectedTime, selectedService.duration),
          status: 'pending',
          number_of_people: parseInt(formData.numberOfPeople),
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          special_requests: formData.specialRequests,
          total_amount: selectedService.price * parseInt(formData.numberOfPeople),
        })
        .select()
        .single();

      if (error) throw error;

      // Show success and navigate
      router.replace(`/business/${business.id}/booking/${data.id}`);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setBooking(false);
    }
  };

  if (businessLoading || servicesLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Book {business?.name}</Text>
      </View>

      <View style={styles.progress}>
        {STEPS.map((step, index) => (
          <View 
            key={step.id}
            style={[
              styles.progressStep,
              index <= currentStep && styles.progressStepActive,
            ]}>
            <Text 
              style={[
                styles.progressStepText,
                index <= currentStep && styles.progressStepTextActive,
              ]}>
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {currentStep === 0 && (
          <View style={styles.services}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService?.id === service.id && styles.serviceCardSelected,
                ]}
                onPress={() => setSelectedService(service)}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
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
                        Max {service.max_capacity} people
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.servicePriceAmount}>
                    {service.price.toLocaleString()} ISK
                  </Text>
                  <Text style={styles.servicePriceLabel}>per person</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.datetime}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
              <Text style={styles.dateButtonText}>
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            {slotsLoading ? (
              <Text style={styles.loadingText}>Loading available times...</Text>
            ) : (
              <View style={styles.timeSlots}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.timeSlotUnavailable,
                      selectedTime === slot.time && styles.timeSlotSelected,
                    ]}
                    disabled={!slot.available}
                    onPress={() => setSelectedTime(slot.time)}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        !slot.available && styles.timeSlotTextUnavailable,
                        selectedTime === slot.time && styles.timeSlotTextSelected,
                      ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of People</Text>
              <TextInput
                style={styles.input}
                value={formData.numberOfPeople}
                onChangeText={(text) => setFormData({ ...formData, numberOfPeople: text })}
                placeholder="Enter number of people"
                placeholderTextColor="#A0AEC0"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Requests</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.specialRequests}
                onChangeText={(text) => setFormData({ ...formData, specialRequests: text })}
                placeholder="Any special requests or requirements"
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.summary}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              
              <View style={styles.summarySection}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>{selectedService?.name}</Text>
                <Text style={styles.summaryPrice}>
                  {selectedService?.price.toLocaleString()} ISK per person
                </Text>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summaryLabel}>Date & Time</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summaryLabel}>Details</Text>
                <Text style={styles.summaryValue}>{formData.name}</Text>
                <Text style={styles.summaryValue}>{formData.email}</Text>
                <Text style={styles.summaryValue}>{formData.phone}</Text>
                <Text style={styles.summaryValue}>
                  {formData.numberOfPeople} {parseInt(formData.numberOfPeople) === 1 ? 'person' : 'people'}
                </Text>
              </View>

              {formData.specialRequests && (
                <View style={styles.summarySection}>
                  <Text style={styles.summaryLabel}>Special Requests</Text>
                  <Text style={styles.summaryValue}>{formData.specialRequests}</Text>
                </View>
              )}

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>
                  {(selectedService?.price * parseInt(formData.numberOfPeople)).toLocaleString()} ISK
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep < STEPS.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!selectedService && currentStep === 0) ||
              (!selectedTime && currentStep === 1) ||
              (!formData.name || !formData.email) && currentStep === 2
                ? styles.nextButtonDisabled
                : null,
            ]}
            onPress={handleNext}
            disabled={
              (!selectedService && currentStep === 0) ||
              (!selectedTime && currentStep === 1) ||
              (!formData.name || !formData.email) && currentStep === 2
            }>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, booking && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={booking}>
            <Text style={styles.confirmButtonText}>
              {booking ? 'Confirming...' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progress: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
  },
  progressStep: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  progressStepActive: {
    backgroundColor: '#45B08C',
  },
  progressStepText: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
  },
  progressStepTextActive: {
    color: '#45B08C',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  services: {
    padding: 20,
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceCardSelected: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderColor: '#45B08C',
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
    justifyContent: 'center',
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
  datetime: {
    padding: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeSlotUnavailable: {
    opacity: 0.5,
  },
  timeSlotSelected: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderColor: '#45B08C',
  },
  timeSlotText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  timeSlotTextUnavailable: {
    color: '#A0AEC0',
  },
  timeSlotTextSelected: {
    color: '#45B08C',
  },
  form: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
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
  summary: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 14,
    color: '#45B08C',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#45B08C',
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

function calculateEndTime(startTime: string, duration: string) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const durationMinutes = parseInt(duration);
  
  const date = new Date();
  date.setHours(hours, minutes + durationMinutes);
  
  return date.toTimeString().slice(0, 5);
}