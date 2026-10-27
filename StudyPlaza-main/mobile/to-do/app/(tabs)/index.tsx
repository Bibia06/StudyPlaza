import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function QuickStartHomeScreen() {
  const router = useRouter();

  // Opções de Acesso Rápido
  const quickActions = [
    {
      id: '1',
      title: 'Meus Cursos',
      description: 'Continue de onde parou',
      icon: 'book-outline',
      color: '#7A58B8',
      route: '/(tabs)/cursos', // ajuste para a sua rota
    },
    {
      id: '2',
      title: 'Atividades',
      description: '3 pendentes esta semana',
      icon: 'document-text-outline',
      color: '#38A169',
      route: '/(tabs)',
    },
    {
      id: '3',
      title: 'Desempenho',
      description: 'Veja suas estatísticas',
      icon: 'stats-chart-outline',
      color: '#DD6B20',
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
              <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardDescription}>{action.description}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#7A58B8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#7A58B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeSubtitle: {
    color: '#E9D8FD',
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
    color: '#2D3748',
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
    color: '#2D3748',
  },
  cardDescription: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
});