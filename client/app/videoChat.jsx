import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import SocketIOClient from 'socket.io-client'; // import socket io
// import WebRTC 
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';

import TextInputContainer from './components/TextInputContainer';


export default function VideoChat({}) {

    const [type, setType] = useState('JOIN');

    const [callerId] = useState(
        Math.floor(100000 + Math.random() * 900000).toString(),
    );

  // Stream of local user
    const [localStream, setlocalStream] = useState(null);

    /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
    const [remoteStream, setRemoteStream] = useState(null);

    const otherUserId = useRef(null);



    useEffect(() => {
        socket.on('newCall', data => {
         /* This event occurs whenever any peer wishes to establish a call with you. */
        });
    
        socket.on('callAnswered', data => {
          /* This event occurs whenever remote peer accept the call. */
        });
    
        socket.on('ICEcandidate', data => {
          /* This event is for exchangin Candidates. */
    
        });
    
        let isFront = false;
    
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
              const sourceInfo = sourceInfos[i];
              if (
                sourceInfo.kind == 'videoinput' &&
                sourceInfo.facing == (isFront ? 'user' : 'environment')
              ) {
                videoSourceId = sourceInfo.deviceId;
              }
            }
      
      
            mediaDevices
              .getUserMedia({
                audio: true,
                video: {
                  mandatory: {
                    minWidth: 500, // Provide your own width, height and frame rate here
                    minHeight: 300,
                    minFrameRate: 30,
                  },
                  facingMode: isFront ? 'user' : 'environment',
                  optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
                },
              })
              .then(stream => {
                // Get local stream!
                setlocalStream(stream);
      
                // setup stream listening
                peerConnection.current.addStream(stream);
              })
              .catch(error => {
                // Log error
              });
          });
    
          peerConnection.current.onaddstream = event => {
            setRemoteStream(event.stream);
          };
      
          // Setup ice handling
          peerConnection.current.onicecandidate = event => {
      
          };
      
          return () => {
            socket.off('newCall');
            socket.off('callAnswered');
            socket.off('ICEcandidate');
          };
        }, []);


  const JoinScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          justifyContent: 'center',
          paddingHorizontal: 42,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: '#1A1C22',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    color: '#ffff',
                    letterSpacing: 6,
                  }}>
                  {callerId}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#1A1C22',
                padding: 40,
                marginTop: 25,
                justifyContent: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Enter call id of another user
              </Text>
              <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId.current}
                setValue={text => {
                  otherUserId.current = text;
                }}
                keyboardType={'number-pad'}
              />
              <TouchableOpacity
                onPress={() => {
                  setType('OUTGOING_CALL');
                }}
                style={{
                  height: 50,
                  backgroundColor: '#5568FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  const OutgoingCallScreen = () => {
    return (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            backgroundColor: '#050A0E',
          }}>
          <View
            style={{
              padding: 35,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 14,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#D0D4DD',
              }}>
              Calling to...
            </Text>
  
            <Text
              style={{
                fontSize: 36,
                marginTop: 12,
                color: '#ffff',
                letterSpacing: 6,
              }}>
              {otherUserId.current}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setType('JOIN');
                otherUserId.current = null;
              }}
              style={{
                backgroundColor: '#FF5D5D',
                borderRadius: 30,
                height: 60,
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CallEnd width={50} height={12} />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

  const IncomingCallScreen = () => {
    return null
  };

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    default:
      return null;
  }

  // This establishes your WebSocket connection
const socket = SocketIOClient('http://10.57.40.92:3500', {
    transports: ['websocket'],
    query: {
        callerId, 
    /* We have generated this `callerId` in `JoinScreen` implementation */
    },
  });

   /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
 const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );



    function leave() {
        peerConnection.current.close();
        setlocalStream(null);
        setType("JOIN");
    }

    const WebrtcRoomScreen = () => {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: "#050A0E",
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            {localStream ? (
              <RTCView
                objectFit={"cover"}
                style={{ flex: 1, backgroundColor: "#050A0E" }}
                streamURL={localStream.toURL()}
              />
            ) : null}
            {remoteStream ? (
              <RTCView
                objectFit={"cover"}
                style={{
                  flex: 1,
                  backgroundColor: "#050A0E",
                  marginTop: 8,
                }}
                streamURL={remoteStream.toURL()}
              />
            ) : null}
            <View
              style={{
                marginVertical: 12,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <IconContainer
                backgroundColor={"red"}
                onPress={() => {
                  leave();
                  setlocalStream(null);
                }}
                Icon={() => {
                  return <CallEnd height={26} width={26} fill="#FFF" />;
                }}
              />
              <IconContainer
                style={{
                  borderWidth: 1.5,
                  borderColor: "#2B3034",
                }}
                backgroundColor={!localMicOn ? "#fff" : "transparent"}
                onPress={() => {
                  toggleMic();
                }}
                Icon={() => {
                  return localMicOn ? (
                    <MicOn height={24} width={24} fill="#FFF" />
                  ) : (
                    <MicOff height={28} width={28} fill="#1D2939" />
                  );
                }}
              />
              <IconContainer
                style={{
                  borderWidth: 1.5,
                  borderColor: "#2B3034",
                }}
                backgroundColor={!localWebcamOn ? "#fff" : "transparent"}
                onPress={() => {
                  toggleCamera();
                }}
                Icon={() => {
                  return localWebcamOn ? (
                    <VideoOn height={24} width={24} fill="#FFF" />
                  ) : (
                    <VideoOff height={36} width={36} fill="#1D2939" />
                  );
                }}
              />
              <IconContainer
                style={{
                  borderWidth: 1.5,
                  borderColor: "#2B3034",
                }}
                backgroundColor={"transparent"}
                onPress={() => {
                  switchCamera();
                }}
                Icon={() => {
                  return <CameraSwitch height={24} width={24} fill="#FFF" />;
                }}
              />
            </View>
          </View>
        );
      };



}