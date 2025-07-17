// VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Text } from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';
import io from 'socket.io-client';

const SIGNALING_SERVER_URL = 'http://10.0.0.9:3500'; // replace with your local IP address
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [callerId] = useState(
  Math.floor(100000 + Math.random() * 900000).toString());

  const socket = useRef(null);
  const peerConnection = useRef(new RTCPeerConnection(configuration));

  const pendingCandidates = useRef([]);
  const remoteDescSet = useRef(false);

  useEffect(() => {
    socket.current = io.connect(SIGNALING_SERVER_URL);

    socket.current.on('connect', () => {
    socket.current.emit('register', callerId);
    });

    socket.current.on('offer', async (offer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    remoteDescSet.current = true;
    pendingCandidates.current.forEach(candidate => {
    peerConnection.current.addIceCandidate(candidate);
    });
    pendingCandidates.current = [];
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.current.emit('answer', {
        targetId: otherUserId.current,
        answer,
    });
    });

    socket.current.on('answer', async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on('ice-candidate', async (candidate) => {
    try {
        const candidate = new RTCIceCandidate(candidate);

        if (remoteDescSet.current) {
        peerConnection.current.addIceCandidate(candidate).catch(err =>
            console.error('❌ Failed to add ICE candidate:', err)
        );
        } else {
        pendingCandidates.current.push(candidate);
        }
    } catch (e) {
        console.error('Error adding ice candidate:', e);
    }
    });

    peerConnection.current.onicecandidate = (event) => {
    if (event.candidate) {
        socket.current.emit('ice-candidate', {
        targetId: otherUserId.current,
        candidate: event.candidate,
        });
    }
    };

    peerConnection.current.onaddstream = (event) => {
      setRemoteStream(event.stream);
    };

    mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      peerConnection.current.addStream(stream);
    });

    

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const startCall = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.current.emit('offer', {
        targetId: otherUserId.current,
        offer,
        });
    };  

  return (
    <View style={{ flex: 1 }}>

        <Text style={{fontSize: 32,color: '#000000',letterSpacing: 6,}}>
            {callerId}
        </Text>
      <Text style={{ textAlign: 'center', marginTop: 40 }}>WebRTC Video Call</Text>

      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ width: '100%', height: 200 }}
        />
      )}

      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ width: '100%', height: 200, marginTop: 20 }}
        />
      )}

      <Button title="Start Call" onPress={startCall} />
    </View>
  );
}