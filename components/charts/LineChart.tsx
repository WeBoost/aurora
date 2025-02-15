import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export function LineChart({ data, title, height = 220 }: LineChartProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      }
      <RNLineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={height}
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
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#45B08C',
          },
        }}
        bezier
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