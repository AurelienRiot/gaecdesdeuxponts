import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { watermarkColor } from "./main-document";

const watermark = StyleSheet.create({
  container: {
    position: "absolute",
    top: "600px",
    left: "100px",
    zIndex: 9999,
    transform: "rotate(-45deg)",
    opacity: 0.5,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: watermarkColor,
    width: 200,
    height: 110,
    paddingHorizontal: 20,
    paddingBottom: 60,
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
