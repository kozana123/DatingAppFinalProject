// VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator  } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  mediaDevices,
  RTCSessionDescription
} from 'react-native-webrtc';
import io from 'socket.io-client';
const SIGNALING_SERVER_URL = 'https://datingappfinalproject-signaling-server.onrender.com'; // replace with your local IP address

// const SIGNALING_SERVER_URL = 'http://10.0.0.5:3500'; // replace with your local IP address
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

  const [connected, setConnected] = useState(false);


  useEffect(() => {
    socket.current = io.connect(SIGNALING_SERVER_URL);

    socket.current.on('connect', () => {
    socket.current.emit('register', callerId);
    });

    peerConnection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
      if (remoteStream) {
        setConnected(true);
      }
    };

    socket.current.on('initiate-offer', async ({ targetId, senderId }) => {
      console.log("offer Activate");
      console.log('📨 Sending offer From:',senderId, 'To:', targetId);

      try {
        otherUserId.current = targetId;
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.current.emit('offer', {
          targetId: targetId,
          offer: offer,
          senderId: senderId,
        });

        console.log("📤 Sent offer successfully");
      } catch (err) {
        console.error("❌ Failed to send offer:", err);
      }
    });

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

    // peerConnection.current.onconnectionstatechange = () => {
    //   console.log("📡 Connection state:", peerConnection.current.connectionState);
    //   if (peerConnection.current.connectionState === "connected") {
    //     console.log("✅ WebRTC connection established!");
    //   }
    // };

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
      
    });

    return () => {
      socket.current.disconnect();

      if (localStream) {
        localStream.getTracks().forEach(track => {track.stop(); });
      }

      // Close peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };

  }, []);

  return (
    <View style={connected ? styles.connectedContainer : styles.searchingContainer}>
    {connected ? (
      <>
        {/* Local stream full screen */}
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
          />
        )}
        {/* Remote stream small in corner */}
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        )}
      </>
    ) : (
      <View style={styles.searchingContent}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.searchingText}>Searching for a partner...</Text>
      </View>
    )}
      {/* <Button title="Start Call" onPress={startCall} /> */}

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
    backgroundColor: '#1e1e2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 0,
  },
  remoteVideo: {
    position: 'absolute',
    width: 120,
    height: 180,
    bottom: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 1,
  },
  searchingContent: {
    alignItems: 'center',
  },
  searchingText: {
    marginTop: 20,
    color: 'white',
    fontSize: 18,
  },
});

