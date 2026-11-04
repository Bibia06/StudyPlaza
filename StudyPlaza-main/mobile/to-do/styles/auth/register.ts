import { StyleSheet } from 'react-native';
import { ThemeType } from '../../constants/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.corFundo,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    box: {
        width: '100%',
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
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
    select: {
        backgroundColor: theme.corSuperficieSecundaria,
        borderWidth: 1,
        borderColor: theme.corBorda,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: theme.roxoPrincipal,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: theme.corFonteInvertida,
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: theme.roxoClaro,
        fontSize: 14,
        fontWeight: '600',
    },
});