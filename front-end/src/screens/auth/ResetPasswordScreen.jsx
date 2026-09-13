import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/auth/ResetPasswordScreen';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/Button';
import ModalAlert from '../../components/ModalAlert';
import apiClient from '../../services/api/clientApi';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params || {}; // Récupération de l'email transmis
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const handleUpdatePassword = async () => {
    if (!code || code.length !== 6) {
      setAlertConfig({
        visible: true,
        title: 'Code invalide',
        message: 'Veuillez saisir le code à 6 chiffres reçu par e-mail.',
        type: 'warning',
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setAlertConfig({
        visible: true,
        title: 'Mot de passe trop court',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Appel à l'API backend pour valider le code à 6 chiffres et changer le mdp
      await apiClient.post('/users/reset-password', {
        email,
        code,
        newPassword
      });

      setIsLoading(false);
      setAlertConfig({
        visible: true,
        title: 'Succès',
        message: 'Votre mot de passe a été réinitialisé avec succès.',
        type: 'success',
      });

      setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        navigation.navigate('Login');
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      setAlertConfig({
        visible: true,
        title: 'Erreur',
        message: error.response?.data?.message || 'Le code a expiré ou est invalide.',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Nouveau mot de passe</Text>
          <Text style={styles.subtitle}>
            Entrez le code à 6 chiffres reçu par e-mail (expire dans 15 minutes) ainsi que votre nouveau mot de passe.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Code de validation (6 chiffres)"
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
          />

          <View style={{ position: 'relative', marginTop: 15 }}>
            <InputField
              label="Nouveau mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
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

          <PrimaryButton 
            title="Mettre à jour le mot de passe" 
            onPress={handleUpdatePassword} 
            isLoading={isLoading} 
          />
        </View>

        <ModalAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;