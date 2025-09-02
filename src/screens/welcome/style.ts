import { StyleSheet } from 'react-native';

/**
 * Define os estilos para a WelcomeScreen.
 * A estrutura utiliza Flexbox para criar um layout de duas partes:
 * - O 'contentContainer' cresce para preencher o espaço disponível, empurrando o 'footer' para baixo.
 * - O 'footer' contém os botões de ação, ancorado na parte inferior da tela.
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20, // Espaçamento geral aplicado na SafeAreaView
    },
    // Container principal que cresce para empurrar o rodapé para baixo
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center', // Centraliza o conteúdo verticalmente no espaço disponível
        alignItems: 'center',
    },
    logo: {
        width: 120, // Reduzimos um pouco para um visual mais clean
        height: 120,
        resizeMode: 'contain',
        marginBottom: 24,
    },
    title: {
        fontSize: 32, // Fonte maior para mais impacto
        fontWeight: 'bold',
        color: '#2D3748', // Cor mais sóbria (cinza escuro)
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18, // Fonte do subtítulo um pouco maior
        color: '#718096', // Cinza mais claro
        textAlign: 'center',
        lineHeight: 26, // Melhora a legibilidade
        paddingHorizontal: 20, // Evita que o texto toque as bordas em telas menores
    },
    // Rodapé que contém os botões de ação
    footer: {
        width: '100%',
        paddingVertical: 10, // Espaçamento vertical para os botões
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12, // Bordas mais arredondadas
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2, // Sombra sutil para Android
        shadowColor: '#000', // Sombra sutil para iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonPrimary: {
        backgroundColor: '#3F83F8',
    },
    buttonSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0', // Borda cinza clara
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonTextSecondary: {
        color: '#2D3748', // Texto cinza escuro para contraste
        fontSize: 18,
        fontWeight: '600',
    },
});