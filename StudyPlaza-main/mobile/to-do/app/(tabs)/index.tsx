import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'; // Importe o FontAwesome6

// Importe o seu Logo SVG (ajuste o caminho se necessário conforme a sua estrutura)
import Logo from '../../assets/images/Logo.svg';

import { useAppTheme } from '../../hooks/use-theme-context'; // Ajuste o caminho

import { createStyles } from '@/styles/tabs/inicio';

export default function QuickStartHomeScreen() {
  const router = useRouter();

  // Pegue também o toggleTheme para fazer o botão de lua/sol funcionar
  const { theme, toggleTheme } = useAppTheme();

  const styles = createStyles(theme);

  const quickActions = [
    {
      id: '1',
      title: 'Meus Cursos',
      description: 'Continue de onde parou',
      icon: 'book-outline',
      color: theme.roxoClaro,
      route: '/(tabs)/cursos',
    },
    {
      id: '2',
      title: 'Meus Grupos',
      description: 'Veja suas comunidades',
      icon: 'people-outline',
      color: theme.corAviso,
      route: '/(tabs)/dash',
    },
    {
      id: '3',
      title: 'Meu Perfil',
      description: 'Gerencie sua conta',
      icon: 'person-outline',
      color: '#3182CE',
      route: '/(tabs)/profile',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* CABEÇALHO FIXO NO TOPO */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={28} height={28} />
          <Text style={styles.headerTitle}>Study Plaza</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Botão de Tema */}
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <FontAwesome6 name="moon" size={20} color={theme.corFonte} />
          </TouchableOpacity>

          {/* Botão de Perfil */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/profile' as any)}
          >
            <FontAwesome6 name="circle-user" size={24} color={theme.corFonte} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Banner de Boas-Vindas */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeSubtitle}>Visão Geral</Text>
          <Text style={styles.welcomeTitle}>Olá, Estudante! 👋</Text>
          <Text style={styles.welcomeText}>
            Pronto para continuar de onde parou no Study Plaza?
          </Text>
          <Image
            source={require('../../assets/images/ElfaEstudando2.png')} // Caminho da sua imagem
            style={styles.imagemDestaque}
            resizeMode="contain"
          />
        </View>

        <View>

        </View>

        {/* Seção Início Rápido */}
        <Text style={styles.sectionTitle}>Início Rápido</Text>

        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardDescription}>{action.description}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={theme.corFonteSecundaria} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

