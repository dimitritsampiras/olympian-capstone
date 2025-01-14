import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';

import { ScreenView } from '../containers/ScreenView';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Header } from '../containers/Header';
import theme from '../../theme';
import { ActionSheet } from 'react-native-ui-lib';
import { HomeParamList } from '../navigation/HomeNavigator';
import { TabParamList } from '../navigation';
import { HorizontalCardScroller } from '../containers/HorizontalCardScroller';
import { useLastPerformedWorkoutQuery, useStaticExercisesQuery } from '../../lib/graphql';
import { Card } from '../containers/Card';
import WeightIcon from '../../../assets/weight.svg';
import WeightIconPurple from '../../../assets/weight2.svg';
import { BodyText, Button, Heading, SubHeading } from '../elements';
import { UserContext } from '../../lib/context';
import { ChevronRightIcon } from 'react-native-heroicons/solid';
import { Calendar } from '../elements/display/Calendar';
import { BellIcon } from 'react-native-heroicons/outline';
import { useIsFocused } from '@react-navigation/native';

interface HomeProps extends NativeStackScreenProps<HomeParamList & TabParamList, 'Home'> {}

/**
 *
 * home screen
 */
export const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { data } = useStaticExercisesQuery();
  const isFocused = useIsFocused();

  const { data: lastData, refetch } = useLastPerformedWorkoutQuery();

  const [visible, setVisible] = useState(false);

  const handleOnGetStartedPress = () => {
    setVisible(true);
  };

  const handleOnDismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    (async () => await refetch())();
  }, [isFocused]);

  return (
    <ScreenView>
      <Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Heading style={{ width: 300 }}>
            Welcome back, {'\n'}
            {user?.profile?.name.split(' ')[0]} 👋
          </Heading>
          <TouchableOpacity onPress={() => navigation.navigate('Socials')}>
            <BellIcon color={theme.colors.gray[900]} />
          </TouchableOpacity>
        </View>
      </Header>

      {/* TODO: render most recent Performed Workout instead this if there is one */}

      {!lastData?.lastPerformedWorkout ? (
        <View style={[styles.infoContainer]}>
          <BodyText style={{ marginBottom: 12 }}>
            You don't have any programs! Click the button to get started.
          </BodyText>
          <Button variant="ghost" colorScheme="info" onPress={handleOnGetStartedPress}>
            Get Started
          </Button>
        </View>
      ) : (
        <>
          <SubHeading as="h3">Last Workout</SubHeading>
          <TouchableOpacity
            style={[styles.lastWorkoutCard, { marginBottom: 18 }]}
            onPress={() =>
              navigation.navigate('PerformedWorkout', {
                performedWorkoutId: lastData.lastPerformedWorkout?.id || '',
              })
            }>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar iso={lastData.lastPerformedWorkout.createdAt} />
              <View style={{ marginLeft: 10 }}>
                <Heading as="h4">{lastData.lastPerformedWorkout.workout.name}</Heading>
                <Text style={{ color: theme.colors.gray[400] }}>
                  {lastData.lastPerformedWorkout.program.name}
                </Text>
              </View>
            </View>
            <ChevronRightIcon color={theme.colors.gray[300]} size={18} />
          </TouchableOpacity>
          <Button
            style={{ paddingBottom: 20 }}
            colorScheme="primary"
            variant="flat"
            onPress={handleOnGetStartedPress}>
            New Program
          </Button>
        </>
      )}

      <SubHeading>Trending Exercises</SubHeading>
      <HorizontalCardScroller>
        {data?.staticExercises.map((exercise) => {
          return (
            <Card key={exercise.id} square style={{ marginRight: 16 }}>
              <View style={{ justifyContent: 'flex-end' }}>
                <WeightIcon />
                <View style={{ marginTop: 8 }}>
                  <Heading as="h4" style={{ marginBottom: 5 }}>
                    {exercise.name}
                  </Heading>
                  <BodyText>5x5 @ 8 RPE</BodyText>
                </View>
              </View>
            </Card>
          );
        })}
      </HorizontalCardScroller>
      <SubHeading style={{ marginTop: 32 }}>Workouts to Swap In</SubHeading>
      <HorizontalCardScroller style={{ marginBottom: 150 }}>
        {data?.staticExercises.map((exercise) => {
          return (
            <Card key={exercise.id} square style={{ marginRight: 16 }}>
              <View style={{ justifyContent: 'flex-end' }}>
                <WeightIconPurple />
                <View style={{ marginTop: 8 }}>
                  <Heading as="h4" style={{ marginBottom: 5 }}>
                    {exercise.name}
                  </Heading>
                  <BodyText>5x5 @ 8 RPE</BodyText>
                </View>
              </View>
            </Card>
          );
        })}
      </HorizontalCardScroller>

      {/*
       *
       *
       * action sheet
       *  */}
      <ActionSheet
        visible={visible}
        onDismiss={handleOnDismiss}
        cancelButtonIndex={3}
        destructiveButtonIndex={0}
        containerStyle={{ paddingBottom: 20 } as ViewStyle}
        options={[
          {
            label: 'Create Program From Scratch',
            onPress: () => navigation.navigate('CreateProgram'),
          },
          { label: 'Browse Programs', onPress: () => navigation.navigate('DiscoverNavigator') },
        ]}
      />
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: theme.colors.gray[200],
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    marginBottom: 24,
  },
  lastWorkoutCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
