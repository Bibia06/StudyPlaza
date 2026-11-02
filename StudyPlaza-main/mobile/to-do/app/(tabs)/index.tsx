import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'; // Importe o FontAwesome6

// Importe o seu Logo SVG (ajuste o caminho se necessário conforme a sua estrutura)
import Logo from '../../assets/images/Logo.svg';

import { useAppTheme } from '../../hooks/use-theme-context'; // Ajuste o caminho

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
      title: 'Atividades',
      description: '3 pendentes esta semana',
      icon: 'document-text-outline',
      color: theme.corSucesso,
      route: '/(tabs)',
    },
    {
      id: '3',
      title: 'Desempenho',
      description: 'Veja suas estatísticas',
      icon: 'stats-chart-outline',
      color: theme.corAviso,
      route: '/(tabs)',
    },
    {
      id: '4',
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

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.corFundo,
  },
  // Estilos do header que você já tinha me mandado:
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // <-- Adicionei paddingHorizontal para alinhar com o resto
    paddingTop: 10,        // <-- Reduzi o paddingTop porque o SafeAreaView já protege a barra de status
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.corFonte,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 4,
  },
  container: {
    padding: 20,
  },
  // ... (o restante dos seus estilos: welcomeCard, grid, card, etc.)
  welcomeCard: {
    backgroundColor: theme.roxoPrincipal,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: theme.roxoPrincipal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeSubtitle: {
    color: theme.roxoClaro,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  welcomeText: {
    color: '#EDF2F7',
    fontSize: 14,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.corFonte,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: theme.corSuperficie,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.corFundo === '#10002b' ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.corFonte,
  },
  cardDescription: {
    fontSize: 12,
    color: theme.corFonteSecundaria,
    marginTop: 2,
  },
});