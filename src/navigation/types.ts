/**
 * @description
 * Arquivo central para a definição de tipos de navegação.
 * Segue o princípio de "Single Source of Truth" (Fonte Única da Verdade),
 * quebrando dependências circulares e organizando o código.
 */

// Tipos para o navegador de Autenticação
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ConfirmEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

// Tipos para o navegador principal (área logada)
export type AppStackParamList = {
  MainTabs: undefined;
  CompleteProfile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: number };
  Chat: {
    conversationId: number;
    recipient: { id: string; full_name: string; avatar_url: string; };
  };
};

// Tipos para o navegador de Abas (Tabs)
export type TabParamList = {
  Início: undefined;
  Pesquisar: undefined;
  Mensagens: undefined;
  Perfil: undefined;
};