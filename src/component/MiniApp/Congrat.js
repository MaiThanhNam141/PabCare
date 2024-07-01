import React from "react";
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { congrat } from "../../data/Link";

const Congrat = ({ modalVisible, setModalVisible }) => {

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
        <Image source={congrat} style={styles.imageCongrat} />
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
          <Text style={styles.buttonText}>Đóng</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87bc9d",
    alignItems: "center",
    justifyContent: "center",
    width:200,
    height:200,
    overflow:'hidden'
  },
  imageCongrat: {
    width: 150,
    height: 150,
  },
  button: {
    borderWidth: 3,
    borderColor: "#87bc9d",
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
