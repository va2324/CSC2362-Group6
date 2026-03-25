import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { register } = useAuth();
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-12)).current;

  function showToast(message) {
    setToast({ visible: true, message });

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -12,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast({ visible: false, message: '' });
      });
    }, 2600);
  }

  async function handleRegister() {
    if (!name || !email || !password || !department) {
      showToast('Please fill in all fields');
      return;
    }

    try {
      await register({ name, email, password, department });
    } catch (e) {
      showToast(e?.message || 'Registration failed');
    }
  }

  return (
    <View style={styles.screen}>
      {toast.visible && (
        <View pointerEvents="none" style={styles.toastLayer}>
          <Animated.View
            style={[
              styles.toast,
              {
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }],
              },
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.icon}>HRCore</Text>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>
                Register your HRCore account
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fields}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#334155"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@company.com"
                  placeholderTextColor="#334155"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#334155"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your department"
                  placeholderTextColor="#334155"
                  value={department}
                  onChangeText={setDepartment}
                  autoCapitalize="words"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
                style={styles.footer}
              >
                <Text style={styles.link}>
                  Already have an account? <Text style={styles.linkBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090D14',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#090D14',
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#0F1521',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
  },
  header: {
    marginBottom: 28,
  },
  icon: {
    fontSize: 25,
    color: '#E94560',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    gap: 18,
  },
  fields: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  input: {
    backgroundColor: '#0C1018',
    color: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#E94560',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  footer: {
    marginTop: 2,
  },
  link: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  linkBold: {
    color: '#E94560',
    fontWeight: '600',
  },
  toastLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
    paddingTop: 24,
  },

  toast: {
    minWidth: 240,
    maxWidth: 360,
    backgroundColor: 'rgba(233, 69, 96, 0.14)',
    borderWidth: 1,
    borderColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },

  toastText: {
    color: '#F1F5F9',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});