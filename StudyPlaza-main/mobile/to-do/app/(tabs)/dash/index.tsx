import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppTheme } from '../../../hooks/use-theme-context';
import Logo from '../../../assets/images/Logo.svg';
import { useAuth } from '../../../contexts/AuthContext';
import api from '@/services/api';

import { createStyles } from '@/styles/dash';

interface IGrupo {
  id: number;
  nome: string;
  descricao: string;
  idioma: 'português' | 'inglês';
  privado: number;
  criado_por: number;
  criador: string;
  total_membros: number;
}

const GRUPO_DEMO: IGrupo = {
  id: 0,
  nome: 'Front-end Colaborativo',
  descricao: 'Estudos semanais focados em React, React Native e boas práticas de UI/UX. Compartilhe código e revise projetos em conjunto.',
  idioma: 'português',
  privado: 0,
  criado_por: 999,
  criador: 'Study Plaza Team',
  total_membros: 12,
};

export default function Dashboard() {
  const { theme, toggleTheme } = useAppTheme();
  const { user } = useAuth();
  const router = useRouter();
  const styles = createStyles(theme);

  const scrollViewRef = useRef<ScrollView>(null);
  const [gruposSectionY, setGruposSectionY] = useState(0);

  const [grupos, setGrupos] = useState<IGrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idioma, setIdioma] = useState<'português' | 'inglês'>('português');

  const carregarGrupos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/grupos');
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setGrupos(response.data);
      } else {
        setGrupos([GRUPO_DEMO]);
      }
    } catch (error) {
      console.log('Erro ao buscar grupos:', error);
      setGrupos([GRUPO_DEMO]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarGrupos();
  }, []);

  const handleScrollToGrupos = () => {
    scrollViewRef.current?.scrollTo({
      y: gruposSectionY,
      animated: true,
    });
  };

  // AÇÃO: PARTICIPAR
  const handleParticipar = async (grupo: IGrupo) => {
    if (!user?.id) {
      Alert.alert('Atenção', 'Você precisa estar logado para entrar em um grupo.');
      return;
    }

    if (grupo.criado_por === user.id) {
      Alert.alert('Aviso', 'Você é o criador deste grupo e já faz parte dele!');
      return;
    }

    Alert.alert(
      'Inscrição no Grupo',
      `Deseja se juntar ao grupo "${grupo.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            try {
              if (grupo.id === 0) {
                Alert.alert('Sucesso', 'Você entrou no grupo de demonstração!');
                return;
              }

              const response = await api.post('/grupos/participar', {
                id_usuario: user.id,
                id_grupo: grupo.id,
              });

              if (response.data.sucesso) {
                Alert.alert('Sucesso', `Você entrou no grupo "${grupo.nome}"!`);
                carregarGrupos();
              }
            } catch (err: any) {
              const msg = err.response?.data?.mensagem || 'Erro ao entrar no grupo.';
              Alert.alert('Aviso', msg);
            }
          } 
        }
      ]
    );
  };

  // AÇÃO: EXCLUIR GRUPO
  const handleExcluirGrupo = (grupo: IGrupo) => {
    if (!user?.id) return;

    Alert.alert(
      'Excluir Grupo',
      `Tem certeza de que deseja excluir o grupo "${grupo.nome}"? Esta ação não poderá ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Se for o grupo de demonstração
              if (grupo.id === 0) {
                setGrupos((prev) => prev.filter((g) => g.id !== 0));
                Alert.alert('Sucesso', 'Grupo de demonstração removido!');
                return;
              }

              const response = await api.delete(`/grupos/${grupo.id}`, {
                data: { id_usuario: user.id },
              });

              if (response.data.sucesso) {
                Alert.alert('Sucesso', 'Grupo excluído com sucesso!');
                carregarGrupos();
              }
            } catch (err: any) {
              const msg = err.response?.data?.mensagem || 'Erro ao excluir o grupo.';
              Alert.alert('Erro', msg);
            }
          },
        },
      ]
    );
  };

  // AÇÃO: CRIAR NOVO GRUPO
  const handleCriarGrupo = async () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o nome e a descrição do grupo.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um grupo.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post('/grupos', {
        nome: nome.trim(),
        descricao: descricao.trim(),
        idioma,
        privado: 0,
        criado_por: user.id,
      });

      if (response.data.sucesso) {
        Alert.alert('Sucesso!', 'Seu grupo foi criado!');
        setModalVisible(false);

        setNome('');
        setDescricao('');
        setIdioma('português');
        carregarGrupos();
      }
    } catch (err: any) {
      console.log('Erro ao criar grupo:', err);
      Alert.alert('Erro', 'Não foi possível criar o grupo. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={28} height={28} />
          <Text style={styles.headerTitle}>Study Plaza</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <FontAwesome6 name="moon" size={20} color={theme.corFonte} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.push('/(tabs)/profile' as any)}
          >
            <FontAwesome6 name="circle-user" size={24} color={theme.corFonte} />
          </TouchableOpacity>
        </View>
      </View>

      {/* HERO SECTION */}
      <View style={styles.heroCard}>
        <View style={styles.badgeAtivos}>
          <Text style={styles.badgeText}>+{grupos.length} grupos ativos</Text>
        </View>

        <Text style={styles.heroTitle}>Encontre o grupo ideal para evoluir nos estudos</Text>

        <Text style={styles.heroDescription}>
          Explore temas, participe de comunidades engajadas, compartilhe materiais e estude com colegas que têm os mesmos objetivos que você.
        </Text>

        <View style={styles.heroButtonsContainer}>
          <TouchableOpacity 
            style={styles.btnPrimaryHero}
            onPress={() => router.push('/(tabs)/cursos' as any)}
          >
            <Text style={styles.btnPrimaryHeroText}>Ir para o painel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnSecondaryHero}
            onPress={handleScrollToGrupos}
          >
            <Text style={styles.btnSecondaryHeroText}>Descobrir grupos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTA DE GRUPOS RECOMENDADOS */}
      <View 
        style={styles.sectionContainer}
        onLayout={(event) => {
          setGruposSectionY(event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Grupos recomendados</Text>
          <TouchableOpacity onPress={handleScrollToGrupos}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.roxoPrincipal} style={{ marginVertical: 20 }} />
        ) : (
          grupos.map((grupo) => {
            const ehCriador = user?.id === grupo.criado_por;

            return (
              <View key={grupo.id} style={styles.cardGrupo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{grupo.nome}</Text>
                  <View style={styles.badgeSituacao}>
                    <FontAwesome6 name="globe" size={10} color={theme.roxoPrincipal} />
                    <Text style={styles.badgeSituacaoText}>
                      {grupo.privado ? 'Privado' : 'Público'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{grupo.descricao}</Text>

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <FontAwesome6 name="user-group" size={14} color={theme.corFonteSecundaria} />
                    <Text style={styles.detailText}>{grupo.total_membros || 1} membro(s)</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FontAwesome6 name="user" size={14} color={theme.corFonteSecundaria} />
                    <Text style={styles.detailText}>
                      Por: {ehCriador ? 'Você' : (grupo.criador || 'Anônimo')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FontAwesome6 name="language" size={14} color={theme.corFonteSecundaria} />
                    <Text style={styles.detailText}>
                      {grupo.idioma === 'português' ? 'Português' : 'Inglês'}
                    </Text>
                  </View>
                </View>

                {/* BOTÕES DE AÇÃO DO CARD */}
                {ehCriador ? (
                  <TouchableOpacity 
                    style={[styles.btnParticipar, { backgroundColor: '#EF4444' }]}
                    onPress={() => handleExcluirGrupo(grupo)}
                  >
                    <FontAwesome6 name="trash-can" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={[styles.btnParticiparText, { color: '#FFF' }]}>
                      Excluir Grupo
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.btnParticipar}
                    onPress={() => handleParticipar(grupo)}
                  >
                    <Text style={styles.btnParticiparText}>Participar</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* CTA: CRIAR PRÓPRIO GRUPO */}
      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Pronto para criar seu próprio grupo?</Text>
        <Text style={styles.ctaDescription}>
          Organize sua turma, personalize regras, convide novos membros e acompanhe tudo no painel em tempo real.
        </Text>
        <TouchableOpacity 
          style={styles.btnCta} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnCtaText}>Começar agora</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Study Plaza - Todos os direitos reservados.</Text>
      </View>

      <View style={{ height: 30 }} />

      {/* MODAL DE CRIAÇÃO DE GRUPO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.corFundo || '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.corFonte || '#111' }}>
                Criar Novo Grupo
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome6 name="xmark" size={20} color={theme.corFonteSecundaria || '#666'} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.corFonte, marginBottom: 4 }}>
              Nome do Grupo *
            </Text>
            <TextInput
              placeholder="Ex: Grupo de Estudos React Native"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
              style={{
                borderWidth: 1,
                borderColor: theme.corBorda || '#E5E7EB',
                borderRadius: 8,
                padding: 10,
                color: theme.corFonte,
                marginBottom: 12,
              }}
            />

            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.corFonte, marginBottom: 4 }}>
              Descrição *
            </Text>
            <TextInput
              placeholder="Descreva o foco, regras e objetivos do grupo..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={descricao}
              onChangeText={setDescricao}
              style={{
                borderWidth: 1,
                borderColor: theme.corBorda || '#E5E7EB',
                borderRadius: 8,
                padding: 10,
                color: theme.corFonte,
                textAlignVertical: 'top',
                marginBottom: 12,
              }}
            />

            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.corFonte, marginBottom: 6 }}>
              Idioma do Grupo
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              {(['português', 'inglês'] as const).map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setIdioma(item)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 6,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: idioma === item ? theme.roxoPrincipal : theme.corBorda || '#E5E7EB',
                    backgroundColor: idioma === item ? '#F3E8FF' : 'transparent',
                  }}
                >
                  <Text style={{ 
                    fontSize: 13, 
                    fontWeight: 'bold', 
                    color: idioma === item ? theme.roxoPrincipal : theme.corFonteSecundaria,
                    textTransform: 'capitalize'
                  }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.corBorda || '#E5E7EB',
                }}
              >
                <Text style={{ color: theme.corFonte, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={submitting}
                onPress={handleCriarGrupo}
                style={{
                  flex: 1,
                  backgroundColor: theme.roxoPrincipal || '#7A58B8',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Cadastrar Grupo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}