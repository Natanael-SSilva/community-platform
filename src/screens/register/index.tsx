import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

/**
 * @description
 * Tela de Cadastro de novos usuários.
 * Inclui validação de nome de usuário e um fluxo de confirmação por código (OTP).
 * A tela se ajusta ao teclado para uma experiência de usuário fluida.
 */
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Valida os campos e tenta criar um novo usuário no Supabase.
   * Em caso de sucesso, navega para a tela de confirmação de e-mail (OTP).
   */
  const handleSignUp = async () => {
    setError('');

    // Validação de nome de usuário (apenas letras e números)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!username.trim() || !email.trim() || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!usernameRegex.test(username)) {
      setError(
        'Nome de usuário pode conter apenas letras e números, sem espaços.',
      );
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { username: username, full_name: username } },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Sucesso! Navega para a tela de confirmação de OTP
      navigation.navigate('ConfirmEmail', { email: email });
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>
              Comece a se conectar com sua comunidade.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  setError('');
                }}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="#A0AEC0"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  setError('');
                }}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="#A0AEC0"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Já tem uma conta?{' '}
                <Text style={styles.loginLink}>Faça Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
