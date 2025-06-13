import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  StatusBar,
  TextInput
} from 'react-native';
import { ChevronLeft, Quote } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Register } from '../../../functions/register';

const SignInScreen = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


const handleRegister = async () => {
  console.log("SignUp clicked", email, password);  // Fixed typo here
  try {
    const res = await Register(email, password);
    console.log("Registration response:", res);
    
    if (res.success) {
      // navigation.navigate('Home');
    } else {
      // Show error to user
      alert(res.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred during registration");
  }
}

  return (
    <ImageBackground
      source={require('../../../assets/73d09b27939ce77c2e1e3be81ecd45f2.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.45)', 'rgba(0, 0, 0, 0.9)']}
        locations={[0, 1]}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign in</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.quoteContainer}>
              <Quote color="#fff" size={24} />
            </View>

            <Text style={styles.title}>
              Sign in to Daily Spark and secure your data
            </Text>

            <Text style={styles.subtitle}>
              Keep your content and settings even if you switch to a new device,
              uninstall the app, or clear the app data
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}

              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              selectionColor="#8B5CF6"
            />

            <TextInput
              style={styles.input}
              value={password}
              
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#ccc"
              selectionColor="#8B5CF6"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.signInButton}>
                <Text style={styles.buttonText}>Sign in </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRegister} style={styles.signInButton}>
                <Text style={styles.buttonText}>Sign up </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.signInButton}>
                <Image 
                  source={require('../../../assets/facebook.png')} 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Sign in with Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.signInButton}>
                <Image 
                  source={require('../../../assets/apple.png')} 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Sign in with Apple</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our{' '}
                <Text style={styles.link}>Terms & Conditions</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(42, 53, 65, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    paddingVertical: 20
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: -150
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  quoteContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(42, 53, 65, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;