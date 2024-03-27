import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Divider } from 'react-native-paper';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder'

const ListSkeleton = () => {
  return (
    <SkeletonPlaceholder >
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          {/* Placeholder for Left Icon */}
          <View style={styles.leftIconPlaceholder} />
          {/* Placeholder for Title and Description */}
          <View style={styles.textPlaceholder} />
          {/* Placeholder for Right Text */}
          <View style={styles.rightTextPlaceholder} />
        </View>
        {/* Divider */}
        <Divider />
      </View>
    </SkeletonPlaceholder>
  );
};

const LoadingPlaceholder = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: "flex-start"  , alignItems: 'center'}}>
          {/* Placeholder for Avatar */}
          <View style={styles.avatarPlaceholder} />
          {/* Placeholder for Text */}
          <View style={styles.textPlaceholder} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};


const TransactionListSkeleton = () => {
  return (
      <View style={{marginTop: 5 }}>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
       


        
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginTop:20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCCCCC', // Placeholder color for Left Icon
    marginRight: 10,
  },
  textPlaceholder: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DDDDDD', // Placeholder color for Title and Description
    marginRight: 10,
  },
  rightTextPlaceholder: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DDDDDD', // Placeholder color for Right Text
  },
  avatarPlaceholder: {
    alignSelf:'center' ,
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#CCCCCC', // Placeholder color for Avatar
  },
  // textPlaceholder: {
  //   flex: 1,
  //   height: 30,
  //   borderRadius:20 ,
  //   backgroundColor: '#DDDDDD', // Placeholder color for Text
  // },
});

export default TransactionListSkeleton;
