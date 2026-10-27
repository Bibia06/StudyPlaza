import React, { useState } from "react";
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

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.roxoPrincipal,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      width: "100%",
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
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    },
    logoImage: {
      padding:0,
      margin:0,
      top:25,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 30,
    },
    title2: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#ffffff",
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
    button: {
      backgroundColor: theme.roxoPrincipal,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 5,
    },
    buttonText: {
      color: theme.corFonteInvertida,
      fontWeight: "bold",
    },
    footerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
    },
    footerText: {
      color: theme.corFonteSecundaria,
      fontSize: 14,
    },
    link: {
      color: theme.roxoClaro,
      fontWeight: "bold",
      fontSize: 14,
    },
  });
