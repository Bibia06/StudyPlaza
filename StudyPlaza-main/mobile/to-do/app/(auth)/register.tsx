import { Link, router } from "expo-router";
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Importa o seu contexto de tema e o tipo
import { useAppTheme } from '../../hooks/use-theme-context';
import { ThemeType } from '../../constants/theme';


// Importa o SVG como um componente React
import Logo from '../../assets/images/Logo.svg';

import api from "../../services/api";

// Importa styles da página
import { createStyles } from '@/styles/auth/register';

export default function Register() {
  const { theme } = useAppTheme(); // Pega as cores do tema atual
  const styles = createStyles(theme); // Gera os estilos dinâmicos baseados no tema

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('estudante');

  async function handleRegister() {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post(
        "/register",
        {
          nome: name,
          email,
          senha: password,
          tipo_usuario: profession
        }
      );

      alert(
        response.data.mensagem
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.replace("/");
    } catch (error: any) {
      console.log(error);
      alert(
        error.response?.data?.mensagem ||
        "Erro ao cadastrar usuário."
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>

        {/* CABEÇALHO COM A CORUJA SVG E O TÍTULO */}
        <View style={styles.headerContainer}>
          <Logo width={36} height={36} style={styles.logoImage} />
          <Text style={styles.title}>
            Venha fazer parte do Study Plaza
          </Text>
        </View>

        {/* NOME */}
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome completo"
          placeholderTextColor={theme.corFonteSecundaria}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="seu@email.com"
          placeholderTextColor={theme.corFonteSecundaria}
        />

        {/* SENHA */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor={theme.corFonteSecundaria}
        />

        {/* CONFIRMAR SENHA */}
        <Text style={styles.label}>Confirmar Senha:</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor={theme.corFonteSecundaria}
        />

        {/* SELECT (PROFISSÃO) */}
        <Text style={styles.label}>Qual é sua profissão:</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={profession}
            onValueChange={(itemValue) => setProfession(itemValue)}
            style={{ color: theme.corFonte }}
            dropdownIconColor={theme.corFonte}
          >
            <Picker.Item label="Estudante" value="estudante" />
            <Picker.Item label="Professor" value="professor" />
          </Picker>
        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* VOLTAR */}
        <TouchableOpacity style={{ marginTop: 15, alignItems: 'center' }}>
          <Link href={"/"} style={styles.link}>Voltar</Link>
        </TouchableOpacity>

      </View>
    </View>
  );
}