import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useUserProgramsQuery } from '../../lib/graphql';
import { Header } from '../containers/Header';
import { ProgramCard } from '../containers/ProgramCard';
import { ScreenView } from '../containers/ScreenView';
import { Button, Heading } from '../elements';
import { MyProgramsParamList } from '../navigation/MyProgramsNavigator';

type ProgramsProps = NativeStackScreenProps<MyProgramsParamList, 'MyPrograms'>;

export const Programs: React.FC<ProgramsProps> = ({ navigation }) => {
  const { data, refetch } = useUserProgramsQuery({ fetchPolicy: 'no-cache' });
  const isFocused = useIsFocused();

  const navigateToProgram = (programId: string) => {
    navigation.navigate('ProgramNavigator', { programId, back: true });
  };

  useEffect(() => {
    isFocused && (async () => await refetch())();
  }, [isFocused]);

  return (
    <ScreenView>
      <Header>
        <Heading>My Programs</Heading>
      </Header>
      {/* TODO: render no programs */}
      {data?.userPrograms.map((program) => (
        <ProgramCard
          userOwned
          key={program.id}
          onPress={() => navigateToProgram(program.id)}
          program={program}
          style={{ marginBottom: 8 }}
        />
      ))}
    </ScreenView>
  );
};
