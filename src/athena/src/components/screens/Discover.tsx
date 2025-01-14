import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';

import {
  useTrendingProgramsQuery,
  usePopularProgramsQuery,
  useTrainingTypesQuery,
} from '../../lib/graphql';

import { ScreenView } from '../containers/ScreenView';
import { Heading } from '../elements/typography/Heading';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubHeading } from '../elements/typography/SubHeading';
import { HorizontalCardScroller } from '../containers/HorizontalCardScroller';
import { Header } from '../containers/Header';
import { ProgramCard } from '../containers/ProgramCard';

import { DiscoverParamList } from '../navigation/DiscoverNavigator';
import { TrainingTypeCard } from '../containers/TrainingTypeCard';
import theme from '../../theme';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { BrowseModal } from '../containers/modals/BrowseModal';
// import SearchBar from 'react-native-dynamic-search-bar';

interface DiscoverProps extends NativeStackScreenProps<DiscoverParamList, 'Discover'> {}

export const Discover: React.FC<DiscoverProps> = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const trainingTypesQuery = useTrainingTypesQuery();

  const trendingQuery = useTrendingProgramsQuery({
    variables: {
      skip: 0,
      take: 10,
    },
  });

  const popularQuery = usePopularProgramsQuery({
    variables: {
      skip: 0,
      take: 10,
    },
  });

  return (
    <ScreenView>
      <BrowseModal
        isOpen={modalVisible}
        close={() => setModalVisible(false)}
        navigation={navigation}
      />
      {/* TOD0: turn this into a header component */}
      <Header>
        <Heading style={{ width: 300 }}>{route.name}</Heading>
      </Header>

      <TouchableOpacity onPress={toggleModal} style={styles.searchBar}>
        <MagnifyingGlassIcon size={18} color={theme.colors.gray[500]} />
        <Text style={{ marginLeft: 10, color: theme.colors.gray[800] }}>Search</Text>
      </TouchableOpacity>

      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <SubHeading>Trending Programs</SubHeading>
        <HorizontalCardScroller>
          {trendingQuery.data?.trendingPrograms.map((program) => (
            <ProgramCard square program={program} key={program.id} style={{ marginRight: 16 }} />
          ))}
        </HorizontalCardScroller>
      </View>
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <SubHeading>Popular</SubHeading>
        <HorizontalCardScroller>
          {popularQuery.data?.popularPrograms.map((program) => (
            <ProgramCard square program={program} key={program.id} style={{ marginRight: 16 }} />
          ))}
        </HorizontalCardScroller>
      </View>
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <SubHeading>Categories</SubHeading>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {trainingTypesQuery.data?.trainingTypes.map((trainingType) => (
            <TrainingTypeCard
              trainingType={trainingType}
              key={trainingType}
              onPress={() => navigation.navigate('TrainingTypeDiscover', { trainingType })}
            />
          ))}
        </View>

        {/* <View style={{ backgroundColor: 'red', height: 10, width: '100%' }}></View> */}
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: theme.colors.gray[100],
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
  },
});
