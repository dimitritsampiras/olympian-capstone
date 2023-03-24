import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Home } from '../screens';
import { CreateProgram } from '../screens/createProgram/CreateProgram';

import { ProgramNavigator } from './ProgramNavigator';
import { TabParamList } from './TabNavigator';

export type HomeParamList = {
  Home: undefined;
  CreateProgram: undefined;
  ProgramNavigator: { programId: string };
};

const HomeStack = createNativeStackNavigator<HomeParamList>();

type HomeStackNavigatorProps = NativeStackScreenProps<TabParamList, 'HomeNavigator'>;

export const HomeNavigator: React.FC<HomeStackNavigatorProps> = ({ route }) => {
  // const {  } = route.params;
  return (
    <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="CreateProgram" component={CreateProgram} />
      <HomeStack.Screen
        name="ProgramNavigator"
        component={ProgramNavigator}
        initialParams={{ programId: '' }}
      />
    </HomeStack.Navigator>
  );
};