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

// Estilos dinâmicos convertidos para suportar o tema claro e escuro
const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.corFundo,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    backgroundColor: theme.corSuperficie,
    borderRadius: 12,
    padding: 20,
    shadowColor: theme.sombra,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.corBorda,
  },
  headerContainer: {
    backgroundColor: theme.roxoPrincipal,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    color: theme.corFonte,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme.corSuperficieSecundaria,
    borderWidth: 1,
    borderColor: theme.corBorda,
    borderRadius: 8,
    padding: 10,
    color: theme.corFonte,
    marginBottom: 15,
  },
  select: {
    backgroundColor: theme.corSuperficieSecundaria,
    borderWidth: 1,
    borderColor: theme.corBorda,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: theme.roxoPrincipal,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: theme.corFonteInvertida,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: theme.roxoClaro,
    fontSize: 14,
    fontWeight: '600',
  },
});