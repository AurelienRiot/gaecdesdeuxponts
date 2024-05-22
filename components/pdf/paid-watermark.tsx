import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { watermarkColor } from "./main-document";

const watermark = StyleSheet.create({
  container: {
    position: "absolute",
    top: "75%",
    left: "20%",
    zIndex: 9999,
    transform: "rotate(-45deg)",
    opacity: 0.5,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: watermarkColor,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  watermarkText: {
    fontSize: 60,
    color: watermarkColor,
  },
});

const PaidWatermark = () => (
  <View style={watermark.container}>
    <Text style={watermark.watermarkText}>Payé</Text>
  </View>
);

export default PaidWatermark;
