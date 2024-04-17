import React from "react";
import { Dimensions, Modal, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const Congrat = ({ modalVisible, setModalVisible }) => {
  const screen = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Image source={require('../../../assets/congrat.jpg')} style={styles.imageCongrat} />
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  imageCongrat: {
    width: 300,
    height: 300,
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    // width: screen.width / 2.2, 
    // height: screen.width / 4, 
    // borderRadius: screen.width / 2, 
    width: 600,
    height: 800,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
});

export default Congrat;
