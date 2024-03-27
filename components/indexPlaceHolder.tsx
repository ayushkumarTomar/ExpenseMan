import { View , StyleSheet } from 'react-native'
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder'
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

const styles = StyleSheet.create({
  container: {
    marginTop:10 ,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarPlaceholder: {
    alignSelf:'center' ,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
    backgroundColor: '#CCCCCC', // Placeholder color for Avatar
  },
  textPlaceholder: {
    flex: 1,
    height: 30,
    borderRadius:20 ,
    backgroundColor: '#DDDDDD', // Placeholder color for Text
  },
});


const IndexSkeletonPlaceholder = ()=>{

    return (
        <View style={{flex:1}}> 
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
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        </View>
    )

}
    

export default IndexSkeletonPlaceholder;