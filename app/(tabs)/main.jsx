import { View, Text, Modal, StyleSheet,TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button, Icon, ButtonGroup } from '@rneui/themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';



export default function Main(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);
  const genders = ["Other", "Female", "Male"];
  const [value, setValue] = useState(0);

  const sliderValuesChange = (values) => setValue(values)

  return (
    <View
      style={{
        flex: 1 ,
        // justifyContent: "center",
        // alignItems: "center",
      }}
      >
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.topModalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.headerText}>Search Settings</Text>
                  <View style={[styles.genderValue]}>
                    <Text style={styles.fontStyle}>Gender:</Text>
                    <ButtonGroup
                      buttons={genders}
                      selectedIndex={genderIndex}
                      onPress={setGenderIndex}
                      containerStyle={{marginTop: 10}}
                    />
                  </View>
                  <View style={[styles.distanceValue]}>
                    <Text style={styles.fontStyle}>Distance:  {value}</Text>
                    <View style={{alignItems: 'center'}}>
                      <MultiSlider   
                        values={[0]}
                        sliderLength={280}
                        onValuesChange={sliderValuesChange}
                        min={0}
                        max={100}
                        allowOverlap={false}
                      />  
                    </View>                
                  </View>
                  <Button size="sm" onPress={() => setModalVisible(false)}>Save</Button>
                </View>
              </TouchableWithoutFeedback>
            </View>
          
          </TouchableWithoutFeedback>
        </Modal>  

        <View style={{flexDirection: 'row', justifyContent: "center", gap: "55%", marginTop: 20, }}>
          <Text style={styles.title}>Dating App</Text>
          <FontAwesome size={30} name="sliders" style={{marginRight: 10}} onPress={() => setModalVisible(!modalVisible)}/> 
        </View>

        <View style={{ flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text>Live Chat</Text>
          <Button
            title="Start"
            buttonStyle={{
              backgroundColor: 'rgb(189, 81, 62)',
              borderWidth: 2,
              borderColor: 'white',
              borderRadius: 30,
            }}
            containerStyle={{
              width: 150,
              marginHorizontal: 50,
              marginBottom: 20
            }}
            titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
            onPress={() => router.navigate("/(tabs)/main")}  
          />
        </View>

      
      
    </View>
  )
}

const styles = StyleSheet.create({
  topModalContainer: {
    flex: 1,
    justifyContent: 'flex-start', // 👈 push content to top
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    alignItems: "center",
    height: '50%',
    backgroundColor: 'rgba(214, 98, 69, 0.9)',
    padding: 10,
  },
  headerText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: 'rgb(235, 231, 236)',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    color: 'rgb(0, 0, 0)',
  },
  distanceValue: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  genderValue: {
    padding: 10,
    width: '100%',
  },
  fontStyle:{
    fontSize: 18, 
    fontWeight: 'bold'
  }
});