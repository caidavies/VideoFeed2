import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

const Item = ({ item, shouldPlay, videoHeight }: {shouldPlay: boolean; item: string; videoHeight: number}) => {
  const player = useVideoPlayer(item, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [shouldPlay, player]);

  const handlePress = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        <VideoView 
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const windowData = Dimensions.get('window');
  
  // Calculate video height: use window height minus 82px
  // This accounts for system UI like status bar, but tab bar may overlay
  const videoHeight = windowData.height;
  
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 82 }
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  }
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
  
  const getItemLayout = (_: any, index: number) => ({
    length: videoHeight,
    offset: videoHeight * index,
    index,
  });
  
  return (
    <View style={styles.container}>
      <FlatList
      data={videos}
      renderItem={({ item, index }) => (
        <Item item={item} shouldPlay={index === currentViewableItemIndex} videoHeight={videoHeight} />
      )}
      keyExtractor={item => item}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      getItemLayout={getItemLayout}
      decelerationRate="fast"
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: Dimensions.get('window').width,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
