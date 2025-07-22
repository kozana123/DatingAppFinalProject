import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CONTAINER_WIDTH = 440;
const CONTAINER_HEIGHT = 956;

export default function Index() {
  return (
    <View style={styles.outerWrapper}>
      <View style={styles.containerWrapper}>
        <SafeAreaView style={styles.container}>
          {/* רקע גרדיאנט */}
          <LinearGradient
            colors={['white', '#572F2D', '#B13A3E']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* עיגול שקוף עליון */}
          <View style={styles.transparentCircleTop} />

          {/* עיגול לוגו */}
          <View style={styles.logoCircle}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828419.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* שם האפליקציה */}
          <Text style={styles.appName}>Luvio</Text>

          {/* כותרת */}
          <Text style={styles.headline}>
            Connect{'\n'}
            People{'\n'}
            Easily &{'\n'}
            Quickly
          </Text>

          {/* תיאור */}
          <Text style={styles.description}>
            Join us to discover your ideal partner and ignite the sparks of romance in your journey.
          </Text>

          {/* כפתור Sign In */}
          <TouchableOpacity style={styles.signInButton} onPress={() => console.log('Sign In')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* טקסט תחתון */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => console.log('Sign Up')}>
              <Text style={styles.footerLink}>sign up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: '#000000', // רקע כהה כדי להדגיש את המסך המצומצם
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWrapper: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  transparentCircleTop: {
    position: 'absolute',
    top: 50,
    left: 120,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.11)',
    shadowColor: '#FFF',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 0,
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3B2E3B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    zIndex: 10,
  },
  logoImage: {
    width: '60%',
    height: '60%',
  },
  appName: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins',
    writingDirection: 'rtl',
  },
  headline: {
    marginTop: 40,
    fontSize: 57,
    fontWeight: '600',
    color: '#F2F5F0',
    fontFamily: 'Inter',
    textAlign: 'right',
    lineHeight: 66,
    writingDirection: 'rtl',
    width: '100%',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    color: '#F2F5F0',
    fontFamily: 'Poppins',
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    width: '100%',
  },
  signInButton: {
    marginTop: 40,
    backgroundColor: '#F2F5F0',
    height: 55,
    width: 286,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BD1414',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  signInText: {
    color: '#28221D',
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  footerContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 17,
    color: '#F2F5F0',
    fontFamily: 'Poppins',
    writingDirection: 'rtl',
  },
  footerLink: {
    fontSize: 17,
    color: '#F2F5F0',
    fontFamily: 'Poppins',
    textDecorationLine: 'underline',
    fontWeight: '600',
    writingDirection: 'rtl',
    marginLeft: 5,
  },
});
