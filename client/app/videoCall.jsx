// VideoCall.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator, Alert, BackHandler, Modal, TouchableOpacity  } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  mediaDevices,
  RTCSessionDescription
} from 'react-native-webrtc';
import io from 'socket.io-client';
import { DataContext } from "./DataContextProvider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { addMatch, addChatSession, addReport } from "../api";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import {MatchAlert} from "./comp/CustomAlerts"; // adjust path





const SIGNALING_SERVER_URL = 'https://datingappfinalproject-signaling-server.onrender.com';
// const SIGNALING_SERVER_URL = 'http://10.0.0.3:3501'; // replace with your local IP address

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoCall() {
  const navigation = useNavigation();
  const router = useRouter();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  // const [callStartTime, setCallStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState();
  // console.log(elapsedTime);
  
  const timerRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [showCustomAlert, setShowCustomAlert] = useState(false);

  const [callerId] = useState(
  Math.floor(100000 + Math.random() * 900000).toString());

  const socket = useRef(null);
  const peerConnection = useRef(null);

  const pendingCandidates = useRef([]);
  const remoteDescSet = useRef(false);
  const otherUserCallId = useRef(null);
  const otherUserSocketId = useRef(null);
  const otherUserId = useRef(null);
  
  const { user, userPref,} = useContext(DataContext);
  
  const [connected, setConnected] = useState(false);
  const [choice, setChoise] = useState(false);
  const [foundPartner, setFoundPartner] = useState(false);
  const [userReady, setReady] = useState(false);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = (startTimestamp) => {

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
      const format = formatTime(elapsedSeconds)
      setElapsedTime(format);
        // console.log(format);
      if(format == "00:05"){
        console.log("GOT TO TIME" + format);
        setChoise(true)
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedTime("00:00");
  };

  const getAge = (birthDateString) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const ready = () => {
    socket.current.emit('check-ready', {senderId: callerId, targetId: otherUserCallId.current});
    setReady(true)
  }

  const notReady = () => {
    socket.current.emit('not-ready', {senderId: callerId, targetId: otherUserCallId.current});
    endCall();
  }

  const handleLike = () => {
    socket.current.emit('like', { targetSocketId: otherUserSocketId.current,});
  };

  const handleDislike = () => {
    socket.current.emit('dislike', { targetSocketId: otherUserSocketId.current });
    handleSaveChat(false)
    endCall(); // End your own call
  };


  const handleSaveChat = async (isMatch) => {
    const minutes = parseInt(elapsedTime.split(":")[0], 10);
    const date = new Date().toISOString(); // current timestamp
    const duration = minutes; // 12 minutes
    const match = isMatch;

    await addChatSession(date, duration, match);
  };

  const report = async (reportReason) =>{
    console.log("Got Reported: " + reportReason);
    const date = new Date().toISOString();
    await addReport(userPref.userId, otherUserId.current, reportReason, date)
    handleDislike()
  }


  const endCall = (reason) => {
    // if (socket.current) socket.current.disconnect();

    // if (localStream) {
    //   localStream.getTracks().forEach((track) => track.stop());
    // }

    // if (peerConnection.current) {
    //   peerConnection.current.close();
    //   peerConnection.current = null;
    // }

    // stopTimer();
    // InCallManager.stop();
    // setConnected(false);
    // setRemoteStream(null);
    // setLocalStream(null);
    // console.log(`this is reason: ${reason}`);
    // router.push({ pathname: "/(tabs)/main", params: { reason: reason }});
    router.replace({ pathname: "/(tabs)/main", params: { reason } });
  };

  const cantGoBack = () =>{
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

  }

  const canGoBack = () =>{
    console.log("can go back");
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }

  const onBackPress = () => {
    // Block back button completely
      return true;
  };


  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(configuration);
    const userInterests = userPref.interests.split(",").map(s => s.trim())
    
    const userDetails = {userId: userPref.userId, userGender: user.gender, userAge: getAge(user.birth_date), latitude: user.latitude, longitude: user.longitude, interests: userInterests , userPref: userPref, }
    socket.current = io.connect(SIGNALING_SERVER_URL);

    socket.current.on('connect', () => {
    socket.current.emit('register', callerId, userDetails);
    });
  
    peerConnection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
      if (remoteStream) {
        setConnected(true);
        // InCallManager.setForceSpeakerphoneOn(true);
      }
    };

    mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100 }}).then((stream) => {
      setLocalStream(stream);
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      }); 
    });

    // InCallManager.start({ media: 'audio/video' });
    // InCallManager.setForceSpeakerphoneOn(true);
    // InCallManager.setVolume(0.1);

    socket.current.on('found-partner', async ({targetId, targetSocketId, targetUserId }) => {
      console.log("found partner");
      cantGoBack();

      try {
        otherUserCallId.current = targetId
        otherUserSocketId.current = targetSocketId;
        otherUserId.current = targetUserId;
        console.log( userPref.userId + ": " + targetId +  " " + targetUserId);
        
        setFoundPartner(true)
      } catch (err) {
        console.error("❌ Failed to set partner:", err);
      }
    });

    socket.current.on('not-ready', () => {
      canGoBack();
      setFoundPartner(false)
      setReady(false)
    });

    socket.current.on('initiate-offer', async ({}) => {
      console.log("offer Activate");
      
      try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        
        

        socket.current.emit('offer', {
          targetSocketId: otherUserSocketId.current,
          offer: offer,
        });

        console.log("📤 Sent offer successfully");
      } catch (err) {
        console.error("❌ Failed to send offer:", err);
      }
    });

    socket.current.on('offer', async ({ offer,}) => {
      try {
        console.log("📤 Got offer successfully");
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        remoteDescSet.current = true;

        for (const candidate of pendingCandidates.current) {
          await peerConnection.current.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        // console.log('the answer', answer, 'to :', otherUserSocketId.current);
        socket.current.emit('answer', {
          targetSocketId: otherUserSocketId.current,
          answer,
        });
      } catch (e) {
        console.error('Error handling offer:', e);
      }
    });

    socket.current.on('answer', async (answer,) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      remoteDescSet.current = true;
      for (const candidate of pendingCandidates.current) {
        await peerConnection.current.addIceCandidate(candidate);
      }
      pendingCandidates.current = [];

      const startTimestamp = Date.now();
      startTimer(startTimestamp);
      socket.current.emit("start-call", { 
        targetSocketId: otherUserSocketId.current, 
        startTimestamp 
      });
    });

    socket.current.on("start-call", ({ startTimestamp }) => {
      startTimer(startTimestamp);
    });

    socket.current.on('ice-candidate', async (data) => {
      try {
        // console.log("GOT ice-candidate---------------------");
        
        const candidate = new RTCIceCandidate(data.candidate);

        if (remoteDescSet.current) {
          await peerConnection.current.addIceCandidate(candidate);
        } else {
          pendingCandidates.current.push(candidate); // store for later
        }
      } catch (e) {
        console.error('Error adding ICE candidate:', e);
      }
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && otherUserSocketId.current) {
        // console.log("📤 otherUserId:", otherUserId.current);
        
        // console.log("📤 Sending ICE candidate");
        socket.current.emit('ice-candidate', {
          targetSocketId: otherUserSocketId.current,
          candidate: event.candidate,
        });
      } else if (!otherUserSocketId.current) {
        console.warn("⚠️ ICE candidate generated before targetId was known. Skipping.");
      }
    };

    // peerConnection.current.onconnectionstatechange = () => {
    //   const state = peerConnection.current.connectionState;
    //   console.log("Peer connection state:", state);

    //   if (state === "connected") {
    //     setIsCallStarted(true); // ✅ enable RTCView rendering now
    //   }

    //   if (state === "disconnected" || state === "failed" || state === "closed") {
    //     // Optionally clean up here
    //     setIsCallStarted(false);
    //     console.log("Peer disconnected or failed");
    //   }
    // };

    socket.current.on('disliked', () => {
      console.log("got disliked");
      endCall(0);
    });

    socket.current.on('liked', () => {
  // Ask if user also likes
      console.log("got liked");
      setShowCustomAlert(true);
    });

    socket.current.on('like-response', ({ response }) => {
      if (response) {
        endCall(2);
      } else {
        endCall(1);
      }
      
    });

    return () => {
      console.log("Return runs");
      canGoBack()
      socket.current.disconnect();
      // InCallManager.stop();
      stopTimer();

      if (localStream) {
        localStream.getTracks().forEach(track => {track.stop(); });
      }

      // Close peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      setConnected(false);
      setRemoteStream(null);
      setLocalStream(null);

    };

  }, []);

  return (
    <View style={connected ? styles.connectedContainer : styles.searchingContainer}>
    {connected ? (
      <>
        {choice && (
          <View style={styles.likeDislikeView}>
            <TouchableOpacity style={styles.notReady} onPress={handleDislike}>
              <Text style={styles.readyText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.readyButton} onPress={handleLike}>
              <Text style={styles.readyText}>Like</Text>
            </TouchableOpacity>
          </View>   
        )}
        {connected && (
          <View >
            <Text style={styles.timer}>{elapsedTime}</Text>
            <SimpleLineIcons style={styles.actionsIcon} name="options-vertical" size={30} color="#ffffffff" onPress={() => setMenuVisible(true)}/>
            <Modal
              transparent
              visible={menuVisible}
              animationType="slide"
              onRequestClose={() => setMenuVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setMenuVisible(false)}
              >
                <View style={styles.bottomSheet}>
                  {step === 1 ? (
                    // STEP 1 - first menu
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setStep(2); // move to next step instead of closing
                      }}
                    >
                      <Text style={[styles.menuText, { color: "red" }]}>Report</Text>
                    </TouchableOpacity>
                  ) : (
                    // STEP 2 - report reasons
                    <>
                      <Ionicons style={{alignSelf: "flex-start", paddingLeft:20,}} name="chevron-back" size={30} color="#000000ff" onPress={() => setStep(1)}/>
                      <Text style={[styles.menuText, { fontWeight: "bold", marginBottom: 10 }]}>
                        Choose reason:
                      </Text>

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          console.log("Reported as Spam");
                          report("Reported as Spam")
                          setMenuVisible(false);
                          setStep(1); // reset for next time
                        }}
                      >
                        <Text style={styles.menuText}>Spam</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          console.log("Reported as Harassment");
                          report("Reported as Harassment")
                          setMenuVisible(false);
                          setStep(1);
                        }}
                      >
                        <Text style={styles.menuText}>Harassment</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          console.log("Reported as Fake Account");
                          report("Reported as Fake Account")
                          setMenuVisible(false);
                          setStep(1);
                        }}
                      >
                        <Text style={styles.menuText}>Fake Account</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>  
        )}
        {/* Local stream small in corner */}
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
          />
        )}
        {/* Remote stream full screen  */}
        {remoteStream  && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
            mirror={true}
          />
        )}
        <MatchAlert
          visible={showCustomAlert}
          onClose={() => setShowCustomAlert(false)}
          onNo={() => {
            socket.current.emit("like-response", {
              targetSocketId: otherUserSocketId.current,
              response: false,
            });
            handleSaveChat(false);
            endCall();
            setShowCustomAlert(false);
          }}
          onYes={() => {
            socket.current.emit("like-response", {
              targetSocketId: otherUserSocketId.current,
              response: true,
            });
            addMatch(userPref.userId, otherUserId.current, true);
            handleSaveChat(true);
            endCall();
            setShowCustomAlert(false);
          }}
        />
      </>
    ) : (    
      <View style={styles.searchingContent}>
        {foundPartner ? (
          <>
            {userReady == false && (
              <View style={{ padding: 14, }}>
                <Text style={styles.searchingText}>Found a partner, do you want to start?</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', zIndex: 2, gap:50, paddingTop: 50, }}>
                   <TouchableOpacity style={styles.notReady} onPress={notReady}>
                      <Text style={styles.readyText}>Not Ready</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.readyButton} onPress={ready}>
                      <Text style={styles.readyText}>Ready</Text>
                    </TouchableOpacity>
                  {/* <Button style={styles.readyButton} title="Ready" onPress={ready} />
                  <Button title="Not Ready" onPress={notReady} color="red" /> */}
                </View> 
              </View>
            )}
            {userReady == true && (
              <View>
                <ActivityIndicator size="large" color="#FF6868" />
                <Text style={styles.searchingText}>Waiting for the partner...</Text>
              </View>
            )}
            
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <ActivityIndicator size="large" color="#FF6868" />
            <Text style={styles.searchingText}>Searching for a partner...</Text>
          </>
        )}
        
      </View>
    )}

  </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  connectedContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  searchingContainer: {
    flex: 1,
    backgroundColor: '#22253fff',
  },
  localVideo: {
   position: 'absolute',
    width: 120,
    height: 180,
    bottom: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 1,
  },
  remoteVideo: {
     position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 0,
  },
  searchingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingText: {
    marginTop: 20,
    paddingHorizontal: 25,
    textAlign: "center",
    color: 'white',
    fontSize: 22,
  },
  timer: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 8,
    zIndex: 3,
  },
  actionsIcon: { 
    position: "absolute",
    alignSelf: "flex-end",
    paddingTop: 20,
    paddingRight:20,
    zIndex: 3,
  },
  modalOverlay: {
    flex: 1, 
    justifyContent: "flex-end" 
  },
  bottomSheet: {
    backgroundColor: 
    "white", 
    paddingVertical: 20, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16 
  },
  menuItem: {
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee" 
  },
  menuText: {
    fontSize: 18, 
    color: "#333", 
    textAlign: "center" 
  },
  readyButton: {
    flex: 1,
    backgroundColor: "#FF6868",
    borderRadius: 10,
    paddingVertical: 10,
  },
  notReady: {
    flex: 1,
    backgroundColor: "#19607E",
    borderRadius: 10,
    paddingVertical: 10,
  },
  readyText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  likeDislikeView:{
    position: 'absolute', 
    top: 60, 
    left: 0, 
    right: 0, 
    flexDirection: 'row',
    gap: 50, 
    paddingHorizontal: 50, 
    justifyContent: 'space-evenly', 
    zIndex: 2, 
  },
    backButton: {
    position: "absolute",
    left: 15,
    top: 15,
    padding: 5,
  },
});


