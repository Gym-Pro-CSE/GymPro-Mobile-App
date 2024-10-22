import React from "react";
import { ScrollView, View, Text , StyleSheet , Dimensions} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Graph = () => {
    console.log("Graph Loaded");
  const graphWidth = Dimensions.get('window').width;

  const data = [
    { value: 50, label: 'Mon' },
    { value: 60, label: 'Tue' },
    { value: 70, label: 'Wed' },
    { value: 90, label: 'Thu' },
    { value: 253, label: 'Fri' },
    { value: 61, label: 'Sat' },
    { value: 23, label: 'Sun' },
    { value: 50, label: 'Mon' },
    { value: 60, label: 'Tue' },
    { value: 70, label: 'Wed' },
    { value: 90, label: 'Thu' },
    { value: 253, label: 'Fri' },
    { value: 61, label: 'Sat' },
    { value: 23, label: 'Sun' },
    { value: 50, label: 'Mon' },
    { value: 60, label: 'Tue' },
  ];

  const renderTooltip = (item) => {
    return (
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>Value: {item.value}</Text>
        <Text style={styles.tooltipText}>Day: {item.label}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{backgroundColor: '#232323' , width:graphWidth*0.959, borderRadius:4, borderWidth:0 , padding:5 , margin:5}}>
      <Text style={styles.subTopicText}>Weekly</Text>
      <View>
        <BarChart
          data={data}
          barWidth={22}
          spacing={10}
          barBorderRadius={4}
          xAxisThickness={0}
          yAxisThickness={0}
          hideYAxisText
          hideRules
          xAxisLabelTextStyle={{color: '#aaa' , fontSize: 11}}
          frontColor="#E2F163"
          isAnimated = {true}
          animationDuration={1000}
          renderTooltip={renderTooltip}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: '#232323',
    padding: 0,
    borderRadius: 0,
    position: 'absolute',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Graph;