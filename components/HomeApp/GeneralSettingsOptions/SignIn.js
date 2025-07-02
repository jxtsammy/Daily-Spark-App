import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { ChevronLeft, Quote } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Register } from '../../../functions/register';
import { SignIn } from '../../../functions/sign-in';
import ToastManager, { Toast } from 'toastify-react-native';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const validateInputs = () => {
    if (!email.trim()) {
      Toast.warn("Please enter your email");
      return false;
    }
    if (!password.trim()) {
      Toast.warn("Please enter your password");
      return false;
    }
    if (password.length < 6) {
      Toast.warn("Password should be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    
    setActiveButton('register');
    setLoading(true);
    Toast.info("Registering...");
    
    try {
      const res = await Register({ email, password });
      console.log("Registration response:", res);
      if (res  === false) {
        Toast.error("Registration failed. Please try again");
        return;
      }

      if (res.success) {
        Toast.success("Registration successful! Please check your email to complete verification");
        setEmail("");
        setPassword("");
      } else {
        Toast.error(res.message || "Registration failed. Please try again");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;
    
    setActiveButton('signin');
    setLoading(true);
    Toast.info("Signing in...");
    
    try {
      const res = await SignIn({ email, password });
      console.log("SignIn response:", res);

      if (res.success) {
        Toast.success("Welcome back!");
        setEmail("");
        setPassword("");
        navigation.navigate("Home");
      } else {
        Toast.error(res.message || "Sign in failed. Please check your credentials");
      }
    } catch (error) {
      console.error("SignIn error:", error);
      Toast.error("An error occurred during sign in");
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../../assets/73d09b27939ce77c2e1e3be81ecd45f2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <ToastManager />
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
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <ChevronLeft color="#fff" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Sign in</Text>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.content}>
                <View style={styles.quoteContainer}>
                  <Quote color="#fff" size={24} />
                </View>

                <Text style={styles.title}>
                  Sign in to Daily Spark and secure your data
                </Text>

                <Text style={styles.subtitle}>
                  Keep your content and settings even if you switch devices
                </Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#ccc"
                  selectionColor="#8B5CF6"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#ccc"
                  selectionColor="#8B5CF6"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={handleSignIn} 
                    style={[
                      styles.signInButton, 
                      activeButton === 'signin' && styles.activeButton
                    ]}
                    disabled={loading}
                  >
                    {loading && activeButton === 'signin' ? (
                      <ActivityIndicator color="#222" />
                    ) : (
                      <Text style={styles.buttonText}>Sign in</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleRegister} 
                    style={[
                      styles.signUpButton,
                      activeButton === 'register' && styles.activeButton
                    ]}
                    disabled={loading}
                  >
                    {loading && activeButton === 'register' ? (
                      <ActivityIndicator color="#222" />
                    ) : (
                      <Text style={styles.buttonText}>Sign up</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our{' '}
                <Text style={styles.link}>Terms & Conditions</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
  input: {
    backgroundColor: 'rgba(42, 53, 65, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    height: 52,
  },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    height: 52,
  },
  activeButton: {
    opacity: 0.7,
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