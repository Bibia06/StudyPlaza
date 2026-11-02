import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/use-theme-context';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from '../../../assets/images/Logo.svg';
import api from '@/services/api';

import {createStyles}  from '@/styles/cursos';

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  plataforma: string;
  modalidade: string;
  duracao_semestres: string | number;
  inscrito?: boolean;
  id_inscricao?: number | null; // Guardará o ID do registro em 'inscricoes'
}

export default function Cursos() {
  const { theme, toggleTheme } = useAppTheme();
  const { user } = useAuth();
  const styles = createStyles(theme);

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [submittingId, setSubmittingId] = useState<number | null>(null);

  // BUSCA CURSOS E MAPEA AS INSCRIÇÕES EXISTENTES
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca todos os cursos disponíveis
      const responseCursos = await api.get<Curso[]>('/cursos');
      let listaCursos = responseCursos.data;

      // Se o usuário estiver logado, busca os cursos inscritos
      if (user?.id) {
        try {
          const responseMeusCursos = await api.get(`/meusCursos/${user.id}`);
          const meusCursos = responseMeusCursos.data;

          // Mapeia os cursos do usuário associando o id_inscricao ao id_curso
          // Espera-se que `meusCursos` traga o ID da inscrição (ex: c.id_inscricao ou c.inscricao_id)
          const mapaInscricoes = new Map<number, number>();
          meusCursos.forEach((c: any) => {
            // Associa o ID do curso com o ID da inscrição
            mapaInscricoes.set(c.id, c.id_inscricao || c.inscricao_id || c.id);
          });

          // Marca `inscrito: true` e atrela o `id_inscricao`
          listaCursos = listaCursos.map((curso) => {
            const temInscricao = mapaInscricoes.has(curso.id);
            return {
              ...curso,
              inscrito: temInscricao,
              id_inscricao: temInscricao ? mapaInscricoes.get(curso.id) : null,
            };
          });
        } catch (errInscricoes) {
          console.log('Erro ao buscar cursos do usuário:', errInscricoes);
        }
      }

      setCursos(listaCursos);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      setError('Não foi possível carregar os cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  // FUNÇÃO DE INSCRIÇÃO NO CURSO
  const handleEnrollCourse = async (id_curso: number) => {
    try {
      const id_usuario = user?.id;

      if (!id_usuario) {
        Alert.alert('Atenção', 'Você precisa estar logado para se inscrever.');
        return;
      }

      setSubmittingId(id_curso);

      const response = await api.post('/inscricoes', {
        id_usuario,
        id_curso,
      });

      if (response.data.sucesso) {
        Alert.alert('Sucesso!', 'Inscrição realizada com sucesso.');
        // Recarrega os cursos para obter o ID exato da nova inscrição gerada
        fetchCourses();
      } else {
        Alert.alert('Erro', response.data.mensagem || 'Erro ao se inscrever.');
      }
    } catch (err: any) {
      console.error('Erro ao realizar inscrição:', err);
      const msg = err.response?.data?.mensagem || 'Falha ao conectar com o servidor.';
      Alert.alert('Erro', msg);
    } finally {
      setSubmittingId(null);
    }
  };

  // FUNÇÃO PARA SAIR DO CURSO (CANCELAR INSCRIÇÃO)
  const handleUnenrollCourse = (curso: Curso) => {
    if (!curso.id_inscricao) {
      // Caso o id_inscricao não venha na lista, usa fallback recarregando a lista
      fetchCourses();
      return;
    }

    Alert.alert(
      'Sair do Curso',
      `Deseja realmente cancelar sua inscrição em "${curso.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair do Curso',
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmittingId(curso.id);

              // Executa a requisição DELETE /inscricoes/:id
              const response = await api.delete(`/inscricoes/${curso.id_inscricao}`);

              if (response.data.sucesso) {
                Alert.alert('Sucesso', `Você saiu do curso "${curso.titulo}".`);

                // Atualiza o estado local removendo a marcação de inscrito
                setCursos((prev) =>
                  prev.map((c) =>
                    c.id === curso.id
                      ? { ...c, inscrito: false, id_inscricao: null }
                      : c
                  )
                );
              } else {
                Alert.alert('Erro', 'Não foi possível cancelar a inscrição.');
              }
            } catch (err: any) {
              console.error('Erro ao cancelar inscrição:', err);
              const msg = err.response?.data?.mensagem || 'Erro ao sair do curso.';
              Alert.alert('Erro', msg);
            } finally {
              setSubmittingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme?.corFonte || '#7A58B8'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <FontAwesome6 name="triangle-exclamation" size={40} color="#DC2626" />
        <Text style={{ color: theme?.corFonte || '#333', marginTop: 12, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchCourses}
          style={{
            marginTop: 16,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#7A58B8',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={28} height={28} />
          <Text style={styles.headerTitle}>Study Plaza</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <FontAwesome6 name="moon" size={20} color={theme?.corFonte || '#333'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {/* Navegação Perfil */}}>
            <FontAwesome6 name="circle-user" size={24} color={theme?.corFonte || '#333'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Listagem de Cursos */}
      <FlatList
        data={cursos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSubmitting = submittingId === item.id;
          const isInscrito = item.inscrito;

          return (
            <View
              style={{
                backgroundColor: theme?.corSuperficie || '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: theme?.corBorda || '#E5E7EB',
                elevation: 2,
              }}
            >
              {/* Tag da Plataforma */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: theme?.roxoPrincipal || '#7A58B8',
                    backgroundColor: '#F3E8FF',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  {item.plataforma ? item.plataforma.toUpperCase() : 'PLATAFORMA'}
                </Text>
              </View>

              {/* Título do Curso */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: theme?.corFonte || '#1A202C',
                  marginBottom: 6,
                }}
              >
                {item.titulo}
              </Text>

              {/* Descrição */}
              <Text
                style={{
                  fontSize: 14,
                  color: theme?.corFonteSecundaria || '#6B7280',
                  marginBottom: 12,
                }}
                numberOfLines={3}
              >
                {item.descricao}
              </Text>

              {/* Rodapé: Modalidade e Duração */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderTopWidth: 1,
                  borderTopColor: theme?.corBorda || '#F3F4F6',
                  paddingTop: 10,
                  marginBottom: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome6 name="graduation-cap" size={14} color={theme?.corFonteSecundaria || '#6B7280'} />
                  <Text style={{ fontSize: 12, color: theme?.corFonteSecundaria || '#6B7280' }}>
                    {item.modalidade}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome6 name="clock" size={14} color={theme?.corFonteSecundaria || '#6B7280'} />
                  <Text style={{ fontSize: 12, color: theme?.corFonteSecundaria || '#6B7280' }}>
                    {item.duracao_semestres} Semestres
                  </Text>
                </View>
              </View>

              {/* BOTÃO DINÂMICO: INSCREVER-SE OU SAIR DO CURSO */}
              {isInscrito ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isSubmitting}
                  onPress={() => handleUnenrollCourse(item)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    borderWidth: 1,
                    borderColor: '#EF4444',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <FontAwesome6 name="arrow-right-from-bracket" size={14} color="#DC2626" />
                      <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 14 }}>
                        Sair do Curso
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isSubmitting}
                  onPress={() => handleEnrollCourse(item.id)}
                  style={{
                    backgroundColor: theme?.roxoPrincipal || '#7A58B8',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <FontAwesome6 name="user-plus" size={14} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
                        Participar do Curso
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ color: theme?.corFonte || '#666' }}>
              Nenhum curso disponível no momento.
            </Text>
          </View>
        }
      />
    </View>
  );
}