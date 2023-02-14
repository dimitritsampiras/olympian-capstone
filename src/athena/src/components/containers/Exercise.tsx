import React from 'react';
import { Text, View } from 'react-native';
import Body, { Muscle } from 'react-native-body-highlighter';
import { ChevronRightIcon, PlusIcon } from 'react-native-heroicons/solid';
import { Button } from 'react-native-ui-lib';
import theme from '../../theme';
import { Card } from './Card';

interface ExerciseProps {
  exerciseName: string;
  muscles: (Muscle & { slug: UIMuscleSlugs })[];
  add: boolean;
}

export const Exercise: React.FC<ExerciseProps> = ({ muscles, exerciseName, add = false }) => {
  const endButton = add ? (
    <Button
      iconSource={PlusIcon}
      outline
      style={{ width: 45, height: 45 }}
      borderRadius={0}
      outlineColor={theme.colors.blue[800]}
    />
  ) : (
    <ChevronRightIcon width={18} fill={theme.colors.gray[200]} />
  );
  return (
    <Card style={{ display: 'flex', flexDirection: 'row' }}>
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 999,
          overflow: 'hidden',
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            right: -8,
            top: 0,
          }}>
          <Body
            scale={0.6}
            data={muscles}
            frontOnly
            colors={[theme.colors.blue[600], theme.colors.blue[300]]}
          />
        </View>
      </View>

      {/* main info column */}
      <View style={{ marginLeft: 15, justifyContent: 'space-between', flex: 1 }}>
        <Text style={{ fontWeight: '700' }}>{exerciseName}</Text>
        <View style={{ flexDirection: 'row' }}>
          {muscles.map((muscle) => (
            <View
              key={muscle.slug}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.gray[200],
                padding: 3,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 4,
                marginRight: 4,
              }}>
              <Text style={{ color: 'gray', fontSize: 10 }}>{muscle.slug}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* chrevron column */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>{endButton}</View>
    </Card>
  );
};

export type UIMuscleSlugs =
  | 'trapezius'
  | 'upper-back'
  | 'lower-back'
  | 'chest'
  | 'biceps'
  | 'triceps'
  | 'forearm'
  | 'back-deltoids'
  | 'front-deltoids'
  | 'abs'
  | 'obliques'
  | 'adductor'
  | 'hamstring'
  | 'quadriceps'
  | 'abductors'
  | 'calves'
  | 'gluteal'
  | 'head'
  | 'neck';
