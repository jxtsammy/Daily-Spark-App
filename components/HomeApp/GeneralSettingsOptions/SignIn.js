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
  Keyboard,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { ChevronLeft, Quote, Eye, EyeOff, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Register } from '../../../functions/register';
import { SignIn } from '../../../functions/sign-in';
import ToastManager, { Toast } from 'toastify-react-native';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    // Animate content in on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      Toast.warn("Please enter your email");
      return false;
    }
    
    if (!emailRegex.test(email)) {
      Toast.warn("Please enter a valid email address");
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

  const validateForgotPasswordEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!forgotPasswordEmail.trim()) {
      Toast.warn("Please enter your email");
      return false;
    }
    
    if (!emailRegex.test(forgotPasswordEmail)) {
      Toast.warn("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    
    setActiveButton('register');
    setLoading(true);
    
    try {
      const res = await Register({ email, password });
      console.log("Registration response:", res);
      
      if (res === false) {
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

  const handleForgotPassword = async () => {
    if (!validateForgotPasswordEmail()) return;
    
    setForgotPasswordLoading(true);
    
    try {
      // Simulate API call - replace with actual forgot password API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Toast.success(`Password reset link sent to ${forgotPasswordEmail}`);
      setForgotPasswordModal(false);
      setForgotPasswordEmail("");
      
    } catch (error) {
      console.error("Forgot password error:", error);
      Toast.error("Failed to send reset link. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openForgotPasswordModal = () => {
    setForgotPasswordEmail(email); // Pre-fill with current email
    setForgotPasswordModal(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.backgroundImage}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <ToastManager />
        <LinearGradient
          colors={['rgba(34, 34, 34, 0.7)', 'rgba(0, 0, 0, 0.95)']}
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
              <Text style={styles.headerTitle}>Welcome</Text>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <Animated.View 
                style={[
                  styles.content,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={styles.quoteContainer}>
                  <Quote color="#fff" size={28} />
                </View>

                <Text style={styles.title}>
                  Sign in to Daily Spark
                </Text>

                <Text style={styles.subtitle}>
                  Secure your quotes and access them across all your devices
                </Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#8D9CB0"
                    selectionColor="#8B5CF6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.passwordLabelContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TouchableOpacity onPress={openForgotPasswordModal}>
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#8D9CB0"
                      selectionColor="#8B5CF6"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={togglePasswordVisibility}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeOff color="#8D9CB0" size={20} />
                      ) : (
                        <Eye color="#8D9CB0" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={handleSignIn} 
                    style={[
                      styles.signInButton, 
                      activeButton === 'signin' && styles.activeButton,
                      loading && styles.disabledButton
                    ]}
                    disabled={loading}
                  >
                    {loading && activeButton === 'signin' ? (
                      <ActivityIndicator color="#222" size="small" />
                    ) : (
                      <Text style={styles.signInButtonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleRegister} 
                    style={[
                      styles.signUpButton,
                      activeButton === 'register' && styles.activeButton,
                      loading && styles.disabledButton
                    ]}
                    disabled={loading}
                  >
                    {loading && activeButton === 'register' ? (
                      <ActivityIndicator color="#222" size="small" />
                    ) : (
                      <Text style={styles.signUpButtonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Continue without account */}
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.continueButtonText}>Continue without account</Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.link}>Terms</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Forgot Password Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={forgotPasswordModal}
          onRequestClose={() => setForgotPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => setForgotPasswordModal(false)}>
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            
            <View style={styles.modalContainer}>
              <View style={styles.modalHandle} />
              
              <View style={styles.modalHeader}>
                <Mail size={24} color="#8B5CF6" />
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalSubtitle}>
                  Enter your email address and we'll send you a link to reset your password
                </Text>
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>Email Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={forgotPasswordEmail}
                  onChangeText={setForgotPasswordEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="#8D9CB0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!forgotPasswordLoading}
                />
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setForgotPasswordModal(false)}
                  disabled={forgotPasswordLoading}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.modalSubmitButton,
                    (!forgotPasswordEmail.trim() || forgotPasswordLoading) && styles.modalSubmitButtonDisabled
                  ]}
                  onPress={handleForgotPassword}
                  disabled={!forgotPasswordEmail.trim() || forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.modalSubmitButtonText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#222',
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
    padding: 20,
    marginBottom: -120
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  quoteContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    height: 52,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeButton: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  continueButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerText: {
    color: '#A0AEC0',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    color: '#8B5CF6',
    textDecorationLine: 'underline',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: height * 0.5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#4A5568',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalInputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalCancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
  },
  modalSubmitButtonDisabled: {
    opacity: 0.6,
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignInScreen;