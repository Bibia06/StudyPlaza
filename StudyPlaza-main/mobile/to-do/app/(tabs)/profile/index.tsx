import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/use-theme-context';
import { createStyles } from '@/styles/profile';
import { useAuth } from '../../../contexts/AuthContext';

// Lista de avatares pré-definidos usando ícones nativos do FontAwesome6
const AVATARES_DISPONIVEIS = [
  'user-graduate',
  'chalkboard-user',
  'user-ninja',
  'user-astronaut',
  'user-tie',
  'user'
];

export default function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Estados locais de controle da edição e formulário
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState(user?.nome || '');
  const [tipoUsuario, setTipoUsuario] = useState<'Estudante' | 'Professor'>(
    (user?.tipo_usuario as 'Estudante' | 'Professor') || 'Estudante'
  );
  const [avatarSelecionado, setAvatarSelecionado] = useState(user?.avatar || 'user-graduate');

  // Sincroniza o estado local quando os dados do usuário mudarem
  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setTipoUsuario((user.tipo_usuario as 'Estudante' | 'Professor') || 'Estudante');
      setAvatarSelecionado(user.avatar || 'user-graduate');
    }
  }, [user]);

  const handleCancel = () => {
    setNome(user?.nome || '');
    setTipoUsuario((user?.tipo_usuario as 'Estudante' | 'Professor') || 'Estudante');
    setAvatarSelecionado(user?.avatar || 'user-graduate');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar em branco.');
      return;
    }

    try {
      setIsLoading(true);

      await updateProfile({
        nome,
        tipo_usuario: tipoUsuario,
        avatar: avatarSelecionado
      });

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* CABEÇALHO DO PERFIL */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <FontAwesome6 name={avatarSelecionado} size={36} color={theme.roxoPrincipal} />
        </View>
        <View style={styles.infoBasica}>
          <Text style={styles.nome}>{user?.nome || user?.email}</Text>
          <Text style={styles.username}>{user?.email}</Text>
          <Text style={{ color: theme.roxoPrincipal, fontWeight: 'bold', marginTop: 2 }}>
            {user?.tipo_usuario || 'Estudante'}
          </Text>
        </View>
      </View>

      {/* SELEÇÃO DE AVATAR (Apenas visível no modo de edição) */}
      {isEditing && (
        <View style={[styles.contentSection, { marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>Escolha seu Avatar</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
            {AVATARES_DISPONIVEIS.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                onPress={() => setAvatarSelecionado(iconName)}
                style={{
                  padding: 10,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: avatarSelecionado === iconName ? theme.roxoPrincipal : 'transparent',
                  backgroundColor: theme.corFundo
                }}
              >
                <FontAwesome6
                  name={iconName}
                  size={24}
                  color={avatarSelecionado === iconName ? theme.roxoPrincipal : theme.corFonteSecundaria}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* CONFIGURAÇÕES DA CONTA */}
      <View style={styles.contentSection}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Configurações da Conta</Text>

          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <FontAwesome6 name="pen-to-square" size={16} color={theme.roxoPrincipal} />
              <Text style={{ color: theme.roxoPrincipal, fontWeight: '600' }}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleCancel} disabled={isLoading}>
              <Text style={{ color: '#ef4444', fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nome Completo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          {isEditing ? (
            <TextInput
              style={[styles.fieldValue, { borderBottomWidth: 1, borderColor: theme.roxoPrincipal, paddingVertical: 4 }]}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor={theme.corFonteSecundaria}
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.nome || 'Não informado'}</Text>
          )}
        </View>

        {/* E-mail (Apenas Leitura) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={[styles.fieldValue, { opacity: 0.6 }]}>{user?.email}</Text>
        </View>

        {/* Seleção da Profissão: Estudante ou Professor */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Perfil de Usuário</Text>
          {isEditing ? (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              {(['Estudante', 'Professor'] as const).map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  onPress={() => setTipoUsuario(opcao)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: tipoUsuario === opcao ? theme.roxoPrincipal : theme.corFundo,
                    borderWidth: 1,
                    borderColor: theme.roxoPrincipal
                  }}
                >
                  <Text style={{ color: tipoUsuario === opcao ? '#FFF' : theme.corFonte, fontWeight: '600' }}>
                    {opcao}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.fieldValue}>{user?.tipo_usuario || 'Estudante'}</Text>
          )}
        </View>

        {/* Botão Salvar (Apenas visível ao editar) */}
        {isEditing && (
          <TouchableOpacity
            style={{ backgroundColor: theme.roxoPrincipal, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 }}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* BOTÃO SAIR */}
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <FontAwesome6 name="right-from-bracket" size={16} color="#ef4444" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}