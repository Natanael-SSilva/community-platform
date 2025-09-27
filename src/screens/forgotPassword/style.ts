import { StyleSheet } from 'react-native';
// Estilos são muito similares aos de outras telas de formulário
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
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
  input: { flex: 1, height: 50, fontSize: 16, color: '#2D3748' },
  button: {
    width: '100%',
    backgroundColor: '#3F83F8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  errorText: {
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
});
