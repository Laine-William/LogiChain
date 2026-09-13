import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../../styles/auth/ResetPasswordScreen';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/Button';
import ModalAlert from '../../components/ModalAlert';
import apiClient from '../../services/api/clientApi';

const VerifyRegisterScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setAlertConfig({
        visible: true,
        title: 'Code invalide',
        message: 'Veuillez saisir le code à 6 chiffres reçu par e-mail.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Appel vers la route backend de vérification du code d'inscription
      await apiClient.post('/users/verify-register-code', { email, code });

      setIsLoading(false);
      setAlertConfig({
        visible: true,
        title: 'Compte validé',
        message: 'Votre compte a été crée !',
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
        message: error.response?.data?.message || 'Le code est invalide ou a expiré.',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Vérification du compte</Text>
          <Text style={styles.subtitle}>
            Entrez le code à 6 chiffres envoyé à {email} pour activer votre compte.
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

          <PrimaryButton 
            title="Valider mon compte" 
            onPress={handleVerifyCode} 
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

export default VerifyRegisterScreen;