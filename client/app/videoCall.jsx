// VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  mediaDevices,
  RTCSessionDescription
} from 'react-native-webrtc';
import io from 'socket.io-client';

const SIGNALING_SERVER_URL = 'http://10.0.0.20:3500'; // replace with your local IP address
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
  const otherUserId = useRef(null);
  const [targetIdInput, setTargetIdInput] = useState('');

  useEffect(() => {
    socket.current = io.connect(SIGNALING_SERVER_URL);

    socket.current.on('connect', () => {
    socket.current.emit('register', callerId);
    });

    peerConnection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
    };

    socket.current.on('offer', async ({ offer, senderId }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        remoteDescSet.current = true;
        otherUserId.current = senderId;
        // Add any stored candidates
        for (const candidate of pendingCandidates.current) {
          await peerConnection.current.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log('the answer', answer, 'to :', otherUserId);

        socket.current.emit('answer', {
          targetId: otherUserId.current,
          answer,
        });
      } catch (e) {
        console.error('Error handling offer:', e);
      }
    });

    socket.current.on('answer', async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on('ice-candidate', async (data) => {
      try {
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
      if (event.candidate && otherUserId.current) {
        console.log("📤 Sending ICE candidate:", event.candidate);
        socket.current.emit('ice-candidate', {
          targetId: otherUserId.current,
          candidate: event.candidate,
        });
      } else if (!otherUserId.current) {
        console.warn("⚠️ ICE candidate generated before targetId was known. Skipping.");
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("📡 Connection state:", peerConnection.current.connectionState);
      if (peerConnection.current.connectionState === "connected") {
        console.log("✅ WebRTC connection established!");
      }
    };

    peerConnection.current.onnegotiationneeded = async () => {

      if (!otherUserId.current) {
        console.warn("⚠️ Skipping negotiation: otherUserId not set yet.");
        return;
      }

      try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.current.emit('offer', {
          targetId: otherUserId.current,
          offer,
          senderId: callerId,
        });
      } catch (e) {
        console.error("Negotiation error:", e);
      }
    };

    mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }}).then((stream) => {
      setLocalStream(stream);
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });
      InCallManager.start({ media: 'video' });
      setTimeout(() => {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setForceSpeakerphoneOn(true); // extra force
        console.warn('🔊 Speakerphone commands issued');
      }, 1000);
      
    });

    return () => {
      socket.current.disconnect();
      // if (InCallManager && typeof InCallManager.stop === 'function') {
      //   InCallManager.stop();
      // }
    };
  }, []);

  const startCall = async () => {

    if (!targetIdInput.trim()) {
      console.warn("Please enter a target ID to call.");
      return;
    }

    otherUserId.current = targetIdInput.trim();
    console.warn("Please enter a Trying to start call.",!targetIdInput.trim());

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.current.emit('offer', {
      targetId: otherUserId.current,
      offer,
      senderId: callerId,
    });
  }; 

  return (
    <View style={{ flex: 1 }}>

        <Text style={{fontSize: 32,color: '#000000',letterSpacing: 6,}}>
            {callerId}
        </Text>
      <Text style={{ textAlign: 'center', marginTop: 40 }}>WebRTC Video Call</Text>

      <TextInput
        placeholder="Enter target user ID"
        placeholderTextColor="#999"
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
          color: 'black'
        }}
        value={targetIdInput}
        onChangeText={setTargetIdInput}
      />

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