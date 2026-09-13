import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { styles } from '../styles/components/InputField';

/**
 * @param {{ label: string, value: string, onChangeText: function, error?: string }} props
 */
const InputField = ({ label, value, onChangeText, error, ...textInputProps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputField;