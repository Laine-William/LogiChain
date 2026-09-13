import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/auth/RegisterScreen';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ModalAlert from '../../components/ModalAlert';
import { userApi } from '../../services/api/userApi';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setAlertConfig({
        visible: true,
        title: 'Champs manquants',
        message: 'Veuillez remplir tous les champs du formulaire.',
        type: 'warning',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertConfig({
        visible: true,
        title: 'Erreur de saisie',
        message: 'Les mots de passe ne correspondent pas.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Appel API d'inscription (qui génère et envoie le code à 6 chiffres par e-mail)
      await userApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setIsLoading(false);
      setAlertConfig({
        visible: true,
        title: 'Code envoyé',
        message: 'Un code de validation à 6 chiffres a été envoyé à votre adresse e-mail.',
        type: 'success',
      });

    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Erreur lors de l\'inscription.';
      setAlertConfig({
        visible: true,
        title: 'Erreur',
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Enregistrement Opérateur</Text>
          <Text style={styles.subtitle}>Rejoignez le réseau LogiChain pour intervenir sur le terrain.</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Nom complet"
            value={formData.fullName}
            onChangeText={(text) => updateForm('fullName', text)}
            placeholder="Jean Dupont"
          />

          <InputField
            label="Adresse Email"
            value={formData.email}
            onChangeText={(text) => updateForm('email', text)}
            placeholder="exemple@logichain.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={{ position: 'relative' }}>
            <InputField
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text) => updateForm('password', text)}
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

          <View style={{ position: 'relative' }}>
            <InputField
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => updateForm('confirmPassword', text)}
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 15, top: 38 }}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={22} 
                color="#6c757d" 
              />
            </TouchableOpacity>
          </View>

          <Button 
            title="S'inscrire" 
            onPress={handleRegister} 
            isLoading={isLoading} 
          />
        </View>

        <ModalAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          duration={1500}
          onClose={() => {
            setAlertConfig({ ...alertConfig, visible: false });
            if (alertConfig.type === 'success') {
              // Redirection vers l'écran de saisie du code en passant l'email
              navigation.navigate('VerifyRegisterCode', { email: formData.email });
            }
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;