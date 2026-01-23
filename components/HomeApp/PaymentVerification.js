import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { VerifyPayment } from '../../functions/verify-payment';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToastManager, { Toast } from 'toastify-react-native';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';


export default function PaymentVerification() {
    const navigation = useNavigation();
    const route = useRoute();
    const { reference, payment_url } = route.params || {};
    const [status, setStatus] = useState('pending'); // pending | success | failed
    const attemptsRef = useRef(0);

    useEffect(() => {
        // listen for deep links so we can dismiss in-app browser when callback arrives
        const onUrl = ({ url }) => {
            try {
                WebBrowser.dismissBrowser();
            } catch (e) {
                // ignore
            }

            try {
                const parsed = new URL(url);
                const ref = parsed.searchParams.get('reference');
                if (ref) {
                    // navigate to the same screen with the reference (this will trigger verification)
                    navigation.replace('PaymentVerification', { reference: ref, payment_url });
                }
            } catch (e) {
                // ignore parse errors
            }
        };

        const subscription = Linking.addEventListener ? Linking.addEventListener('url', ({ url }) => onUrl({ url })) : Linking.addListener('url', onUrl);
        let mounted = true;
        const maxAttempts = 6; // try a bit longer from the dedicated screen
        const intervalMs = 3000;

        if (!reference) {
            setStatus('failed');
            return;
        }

        const verifyOnce = async () => {
            try {
                const res = await VerifyPayment(reference);
                console.log('PaymentVerification response:', res);
                if (!mounted) return;

                if (res?.status === 'success') {
                    setStatus('success');
                    Toast.success('Payment verified successfully');
                    // Navigate to Home after successful payment
                    setTimeout(() => {
                        navigation.replace('Home');
                    }, 1500);
                    return true;
                }

                return false;
            } catch (err) {
                console.error('Error verifying payment on screen:', err);
                return false;
            }
        };

        const poll = async () => {
            // first immediate attempt
            let ok = await verifyOnce();
            attemptsRef.current++;
            if (ok) return;

            const id = setInterval(async () => {
                if (!mounted) return clearInterval(id);
                if (attemptsRef.current >= maxAttempts) {
                    clearInterval(id);
                    setStatus('failed');
                    Toast.error('Payment verification failed. Please check later.');
                    return;
                }

                const ok2 = await verifyOnce();
                attemptsRef.current++;
                if (ok2) {
                    clearInterval(id);
                }
            }, intervalMs);
        };

        poll();

        return () => {
            mounted = false;
            if (subscription && subscription.remove) subscription.remove();
        };
    }, [reference, navigation]);

    const openPaymentUrl = async () => {
        if (payment_url) {
            try {
                // open in browser using Linking to let user complete payment again
                await Linking.openURL(payment_url);
            } catch (err) {
                console.error('Failed to open payment url', err);
                Toast.error('Could not open payment URL');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ToastManager />

            <View style={styles.content}>
                <Text style={styles.title}>Verifying payment</Text>
                {status === 'pending' && (
                    <>
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                        <Text style={styles.message}>Please wait while we verify your payment...</Text>
                        <TouchableOpacity style={styles.button} onPress={openPaymentUrl}>
                            <Text style={styles.buttonText}>Open payment page</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <Text style={styles.success}>Payment confirmed 🎉</Text>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <Text style={styles.failed}>Verification failed</Text>
                        <Text style={styles.message}>You can try opening the payment page or check back later.</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
                            <Text style={styles.buttonText}>Go to Home</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#222', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    title: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    message: { color: '#A0AEC0', marginTop: 12, textAlign: 'center' },
    success: { color: '#9AE6B4', fontSize: 20, marginTop: 20 },
    failed: { color: '#FEB2B2', fontSize: 20, marginTop: 20 },
    button: { marginTop: 20, backgroundColor: '#6B21A8', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 24 },
    buttonText: { color: 'white', fontWeight: '600' },
});
