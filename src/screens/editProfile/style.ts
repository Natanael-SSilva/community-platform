import { StyleSheet } from 'react-native';

// Este estilo é muito similar ao que já tínhamos para o formulário de perfil
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3F83F8',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFEFEF', // Cor de fundo caso a imagem não carregue
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 120, // Ajuste para posicionar corretamente sobre o avatar
    backgroundColor: '#3F83F8',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  // Estilo para o campo de localização clicável
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  locationPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
});
