import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, StyleProp, ViewStyle } from "react-native";

export function IconSymbol({ name, size = 24, color, style }) {
  return (
    <View style={style}>
      <MaterialIcons color={color} size={size} name={MAPPING[name]} />
    </View>
  );
}
