// src/constants/theme.ts

export const lightTheme = {
  fontFamily: 'Poppins', // Requer carregamento da fonte via expo-font
  roxoPrincipal: '#6a4c93',
  roxoClaro: '#a88beb',
  roxoEscuro: '#231942',
  corFundo: '#f9f9f9',
  corSuperficie: '#ffffff',
  corSuperficieSecundaria: '#f3f0f8',
  corFonte: '#333333',
  corFonteSecundaria: '#666666',
  corFonteInvertida: '#ffffff',
  corAtivo: '#bfdfff',
  corHover: '#231942',
  corFoco: '#a88beb',
  corBorda: '#dddddd',
  sombra: 'rgba(0, 0, 0, 0.08)',
  gradientPrincipal: ['#6a4c93', '#a88beb'],
  corErro: '#e63946',
  corSucesso: '#2a9d8f',
  corAviso: '#f4a261',
};

export const darkTheme = {
  ...lightTheme, // Reaproveita as chaves e sobrescreve apenas as cores do modo escuro
  fontFamily: 'Poppins',
  roxoPrincipal:  '#10002b',
  roxoClaro: '#cdb4db',
  roxoEscuro: '#9d4edd',
  corFundo: '#10002b',
  corSuperficie: '#240046',
  corSuperficieSecundaria: '#3c096c',
  corFonte: '#f9f9f9',
  corFonteSecundaria: '#d0c7d8',
  corFonteInvertida: '#ffffff',
  corAtivo: '#9d4edd',
  corHover: '#8338ec',
  corFoco: '#c77dff',
  corBorda: '#4a2a68',
  sombra: 'rgba(0, 0, 0, 0.35)',
  gradientPrincipal: ['#3c096c', '#240046', '#10002b'],
  corErro: '#ff8080',
  corSucesso: '#52b788',
  corAviso: '#ffb86b',
};

// Exportamos o tipo do tema para usar nos contextos e estilos
export type ThemeType = typeof lightTheme;



