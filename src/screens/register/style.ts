import { StyleSheet } from 'react-native';

// Reutilizaremos a base de estilos do Login para manter a consistência
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2D3748',
  },
  icon: {
    marginLeft: 10,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#3F83F8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#718096',
  },
  loginLink: {
    color: '#3F83F8',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
});
