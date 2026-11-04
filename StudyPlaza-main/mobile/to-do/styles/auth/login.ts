import { StyleSheet } from 'react-native';
import { ThemeType } from '../../constants/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
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
