import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      colors?: string[];
    }[];
  };
  title?: string;
  height?: number;
}

export function BarChart({ data, title, height = 220 }: BarChartProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      }
      <RNBarChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={height}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#0B1021',
          backgroundGradientFrom: '#0B1021',
          backgroundGradientTo: '#0B1021',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(69, 176, 140, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(160, 174, 192, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.7,
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
});