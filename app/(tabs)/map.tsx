import { View, StyleSheet, Platform } from 'react-native';
import { InteractiveMap } from '@/components/InteractiveMap';
import { LocationSearch } from '@/components/LocationSearch';

export default function MapPage() {
  return (
    <View style={styles.container}>
      <InteractiveMap />
      <LocationSearch
        onSelect={(location) => {
          // Pan map to selected location
          console.log('Selected location:', location);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
});