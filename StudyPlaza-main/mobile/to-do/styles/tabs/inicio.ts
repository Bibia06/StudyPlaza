import { StyleSheet } from 'react-native';
import { ThemeType } from '../../constants/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingTop: 20,
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
  imagemDestaque: {
  width: '100%',  // Ocupa toda a largura disponível
  height: 200,    // Defina uma altura fixa
  borderRadius: 12,
  marginTop: 15,
  left: 10,
},
});