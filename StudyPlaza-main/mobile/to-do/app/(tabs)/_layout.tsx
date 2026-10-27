import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/use-theme-context';

export default function TabsLayout() {
  const { theme } = useAppTheme();

  // Se o tema ainda for undefined, podemos aplicar um objeto padrão com Optional Chaining (?.):
  const t = theme ?? {
    corSuperficie: '#FFFFFF',
    corBorda: '#E2E8F0',
    roxoPrincipal: '#7A58B8',
    corFonteSecundaria: '#A0AEC0',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.corSuperficie,
          borderTopColor: t.corBorda,
          elevation: 5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: t.roxoPrincipal,
        tabBarInactiveTintColor: t.corFonteSecundaria,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={22} color={ color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dash/index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="gauge-high" size={22} color={color} />
          ),
        }}
      />

            <Tabs.Screen
        name="cursos/index"
        options={{
          title: 'Cursos',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="book" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="circle-user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}