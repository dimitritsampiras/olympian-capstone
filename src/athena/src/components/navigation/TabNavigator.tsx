import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  GlobeAsiaAustraliaIcon,
  BookOpenIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import { Home } from '../screens';
import { Profile } from '../screens/Profile';
import { Programs } from '../screens/Programs';
import { Browse } from '../screens/Browse';
import { StaticExercise } from '../screens/staticExercise/StaticExercise';

export type TabParamList = {
  Home: undefined;
  Programs: undefined;
  Browse: undefined;
  Profile: undefined;
  StaticExercise: undefined;
};
const Tabs = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="Home" component={Home} options={{ tabBarIcon: HomeIcon }} />
      <Tabs.Screen
        name="Browse"
        component={Browse}
        options={{ tabBarIcon: GlobeAsiaAustraliaIcon }}
      />
      <Tabs.Screen name="Programs" component={Programs} options={{ tabBarIcon: BookOpenIcon }} />
      <Tabs.Screen name="Profile" component={Profile} options={{ tabBarIcon: UserIcon }} />
      <Tabs.Screen
        name="Static Exercise"
        component={StaticExercise}
        options={{ tabBarIcon: BookOpenIcon }}
      />
    </Tabs.Navigator>
  );
};
