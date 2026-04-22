import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop, Circle } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { colors } from "../src/theme";

type LineChartProps = {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
};

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  const path = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midX = (previous.x + current.x) / 2;
    const midY = (previous.y + current.y) / 2;
    path.push(`Q ${previous.x} ${previous.y} ${midX} ${midY}`);
  }

  const last = points.at(-1);
  if (last) {
    path.push(`T ${last.x} ${last.y}`);
  }

  return path.join(" ");
}

export function LineChart({
  data,
  width = 320,
  height = 180,
  strokeColor = colors.primary,
  fillColor = colors.primarySoft,
}: LineChartProps) {
  const padding = 12;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = Math.max(maxValue - minValue, 1);

  const points = data.map((value, index) => {
    const x = padding + (availableWidth / Math.max(data.length - 1, 1)) * index;
    const normalizedValue = (value - minValue) / range;
    const y = padding + availableHeight - normalizedValue * availableHeight;

    return { x, y };
  });

  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${padding + availableWidth} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={fillColor} stopOpacity={0.7} />
            <Stop offset="100%" stopColor={fillColor} stopOpacity={0.05} />
          </SvgLinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#areaGradient)" />
        <Path d={linePath} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <Circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r={4} fill={colors.surface} stroke={strokeColor} strokeWidth={2} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  // Placeholder for future chart-specific styling hooks.
});