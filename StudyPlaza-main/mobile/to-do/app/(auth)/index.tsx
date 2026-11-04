import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { useAppTheme } from "../../hooks/use-theme-context";
import { ThemeType } from "../../constants/theme";

// Importa o SVG como um componente React
import Logo from "../../assets/images/Logo.svg";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

import { createStyles } from '@/styles/auth/login';

export default function Login() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    // 1. Validação dos campos obrigatórios
    if (!email || !password) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      // 2. Requisição para a rota de login
      const response = await api.post("/login", {
        email,
        senha: password,
      });

      await signIn({
        email,
        token: response.data.token,
        user: response.data.usuario,
      });

      // 3. Exemplo de como guardar o token (caso o teu backend retorne um token JWT)
      // if (response.data.token) {
      //   await SecureStore.setItemAsync("user_token", response.data.token);
      // }

      alert(response.data.mensagem || "Login realizado com sucesso!");

      // 4. Limpar os campos
      setEmail("");
      setPassword("");

      // 5. Redirecionar para a tela principal (ex: /dashboard ou /(tabs))
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert(
        error.response?.data?.mensagem ||
          "Erro ao realizar login. Verifique as suas credenciais.",
      );
    }
  }

  const { theme, toggleTheme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
              <View style={{alignItems: "center", flexDirection: "column"}}>
        <Logo width={130} height={130} style={styles.logoImage}/>
          <Text style={styles.title}>Study Plaza</Text>    
          </View>   
      <View style={styles.card}>
        {/* CABEÇALHO COM A CORUJA SVG E O TÍTULO */}
        <View style={styles.headerContainer}>

          <Text style={styles.title2}>Bem-vindo a Nossa Plataforma!</Text>
        </View>

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          onChangeText={setEmail}
          placeholderTextColor={theme.corFonteSecundaria}
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="********"
          onChangeText={setPassword}
          placeholderTextColor={theme.corFonteSecundaria}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Link para ir para a tela de cadastro */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <Link href="/register" style={styles.link}>
            Cadastre-se aqui
          </Link>
        </View>

        {/* Botão opcional para testar a troca de tema */}
        <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20 }}>
          <Text
            style={{
              color: theme.roxoClaro,
              textAlign: "center",
              fontSize: 13,
            }}
          >
            🔄 Alternar Tema
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

