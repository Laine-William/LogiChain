import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../../styles/auth/LoginScreen';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ModalAlert from '../../components/ModalAlert';
import { userApi } from '../../services/api/userApi';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertConfig({
        visible: true,
        title: 'Champs requis',
        message: 'Veuillez renseigner votre email et votre mot de passe.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await userApi.login({ email, password });
      console.log('✅ Connexion réussie :', response);

      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;

      if (token && user) {
        await useAuthStore.getState().setAuth(user, token);
      } else {
        console.warn('⚠️ Données utilisateur manquantes dans la réponse de l\'API');
      }

      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      console.error('❌ Erreur de connexion :', error);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Identifiants incorrects ou serveur injoignable.';

      setAlertConfig({
        visible: true,
        title: 'Erreur d\'authentification',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>LogiChain</Text>
        <Text style={styles.subtitle}>Plateforme logistique terrain - Connexion opérateur</Text>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Adresse Email"
          value={email}
          onChangeText={setEmail}
          placeholder="exemple@logichain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{ position: 'relative' }}>
          <InputField
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 15, top: 38 }}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={22} 
              color="#6c757d" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <Button 
          title="Se connecter" 
          onPress={handleLogin} 
          isLoading={isLoading} 
        />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

      <ModalAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        duration={1500}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;