import { View, Text, Modal, StyleSheet,TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button, ButtonGroup } from '@rneui/themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';





export default function Main(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);
  const [tempGenderIndex, setTrmpGenderIndex] = useState(null);
  const genders = ["Other", "Female", "Male"];
  const [tempDistance, setTempDistance] = useState([30]);
  const [tempAge, setTempAge] = useState([18, 30]);
  const [distance, setDistanceValue] = useState([30]);
  const [age, setAgeValue] = useState([18, 30]);

  const ageSliderValuesChange = (values) => setTempAge(values)

  const openModal = () => {
    setTrmpGenderIndex(genderIndex)
    setTempDistance(distance);
    setTempAge(age)
    setModalVisible(true);      
  };

  const closeModal = () => {
    setGenderIndex(tempGenderIndex)
    setDistanceValue(tempDistance);
    setAgeValue(tempAge)  
    setModalVisible(false); 
  };


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
            <View style={styles.topModalContainer }>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>

                  <View style={{flexDirection: 'row', alignItems: "center", justifyContent: 'space-between',width: '100%',}}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <FontAwesome size={24} name="close" style={{marginRight: 10}}/> 
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 9, alignItems: 'center', marginLeft: '-10%' }}>
                      <Text style={styles.headerText}>Search Settings</Text>
                    </View>
                  </View>

                  <View style={[styles.genderValue]}>
                    <Text style={styles.fontStyle}>Gender:</Text>
                    <ButtonGroup
                      buttons={genders}
                      selectedIndex={tempGenderIndex}
                      onPress={setTrmpGenderIndex}
                      containerStyle={{marginTop: 10}}
                    />
                  </View>

                  <View style={[styles.distanceValue]}>
                    <Text style={styles.fontStyle}>Distance:  {tempDistance}</Text>
                    <View style={{alignItems: 'center'}}>
                      <MultiSlider   
                        values={tempDistance}
                        onValuesChange={setTempDistance}
                        min={0}
                        max={100}
                        allowOverlap={false}
                        selectedStyle={styles.selected}
                        unselectedStyle={styles.unselected}
                        trackStyle={styles.track}
                        markerStyle={styles.marker}
                        pressedMarkerStyle={styles.pressedMarker}
                      />  
                  </View>   

                  </View>
                  <View style={[styles.ageValue]}>
                    <Text style={styles.fontStyle}>Age:  {tempAge[0]} - {tempAge[1]}</Text>
                    <View style={{alignItems: 'center'}}>
                      <MultiSlider   
                        values={[tempAge[0], tempAge[1]]}
                        onValuesChange={ageSliderValuesChange}
                        min={18}
                        max={70}
                        allowOverlap={false}
                        selectedStyle={styles.selected}
                        unselectedStyle={styles.unselected}
                        trackStyle={styles.track}
                        markerStyle={styles.marker}
                        pressedMarkerStyle={styles.pressedMarker}
                      />  
                  </View>  

                  </View>
                  <Button
                    title="Save"
                    buttonStyle={{
                      backgroundColor: 'rgb(189, 81, 62)',
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 30,
                    }}
                    containerStyle={{
                      width: 80,
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    onPress={closeModal}  
                    TouchableComponent={TouchableWithoutFeedback}
                  />

                </View>
              </TouchableWithoutFeedback>
            </View>
          
          </TouchableWithoutFeedback>
        </Modal>  

        <View style={{flexDirection: 'row', justifyContent: "center", gap: "55%", marginTop: 20, }}>
          <Text style={styles.title}>Dating App</Text>
          <FontAwesome size={30} name="sliders" style={{marginRight: 10}} onPress={openModal}/> 
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
    backgroundColor: 'rgba(238, 144, 120, 0.9)',
    padding: 10,
  },
  headerText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: 'rgb(41, 40, 40)',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    color: 'rgb(0, 0, 0)',
  },
  distanceValue: {
    paddingLeft: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  ageValue: {
    paddingLeft: 10,
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
  },
  selected: {
    backgroundColor: 'rgb(161, 27, 27)',
    height: 8,
  },
  unselected: {
    backgroundColor: 'rgb(255, 214, 214)',
    height: 6,
  },
  track: {
    borderRadius: 6,
  },
  marker: {
    height: 20,
    width: 20,
    borderRadius: 12,
    backgroundColor: 'rgb(241, 121, 121)',
    borderWidth: 2,
    borderColor: 'rgb(0, 0, 0)',
    marginTop: 7
    
  },
  pressedMarker: {
    backgroundColor: 'rgb(182, 90, 90)',
  },


});