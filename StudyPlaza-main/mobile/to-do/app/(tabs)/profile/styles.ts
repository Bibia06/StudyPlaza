import { StyleSheet } from 'react-native';
import { ThemeType } from '../../../constants/theme'; 

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.corFundo,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.corSuperficie,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.corBorda,
    shadowColor: theme.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.corSuperficieSecundaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: theme.corBorda,
  },
  infoBasica: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.corFonte,
  },
  username: {
    fontSize: 14,
    color: theme.corFonteSecundaria,
    marginTop: 4,
  },
  navContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.corBorda,
  },
  navItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: theme.roxoPrincipal,
    gap: 8,
  },
  navItemTextActive: {
    color: theme.roxoPrincipal,
    fontWeight: 'bold',
    fontSize: 15,
  },
  contentSection: {
    backgroundColor: theme.corSuperficie,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.corBorda,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.corFonte,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: theme.corFonteSecundaria,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: theme.corFonte,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.corSuperficie,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  }
});