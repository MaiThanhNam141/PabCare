import React, {useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GoldenSleep = () => {
    const [selectedItem, setSelectedItem] = useState('item1');

    return (
        <View style={styles.container}>
            <Picker
              mode='dialog'
              style={styles.picker}
              selectedValue={selectedItem}
              onValueChange={(itemValue) =>
                setSelectedItem(itemValue)
              }>
                <Picker.Item label="Mục 1" value="item1" />
                <Picker.Item label="Mục 2" value="item2" />
                <Picker.Item label="Mục 3" value="item3" />
                <Picker.Item label="Mục 4" value="item4" />
                <Picker.Item label="Mục 5" value="item5" />
            </Picker>
            <Text style={{ fontSize: 20, marginTop: 20 }}>Mục đã chọn: {selectedItem}</Text>
        </View>
    );
};

export default GoldenSleep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker:{
        flex: 1,
        maxWidth: 150,
        marginLeft: 0,
        color:'black',
        backgroundColor:'white'
    }
});