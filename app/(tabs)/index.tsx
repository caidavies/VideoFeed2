import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

// Mock data for each video
const videoData = [
  { username: 'user1', avatar: 'https://i.pravatar.cc/150?img=1', likes: 1234, comments: 56, shares: 12, caption: 'Amazing sunset view from the mountains! 🌄 #nature #sunset' },
  { username: 'user2', avatar: 'https://i.pravatar.cc/150?img=2', likes: 5678, comments: 234, shares: 45, caption: 'Just finished this incredible hike! The view was worth every step. #hiking #adventure' },
  { username: 'user3', avatar: 'https://i.pravatar.cc/150?img=3', likes: 890, comments: 34, shares: 8, caption: 'Coffee and coding ☕️💻 Working on something exciting!' },
  { username: 'user4', avatar: 'https://i.pravatar.cc/150?img=4', likes: 2345, comments: 123, shares: 23, caption: 'Beautiful day at the beach! 🏖️ #beach #summer' },
  { username: 'user5', avatar: 'https://i.pravatar.cc/150?img=5', likes: 4567, comments: 189, shares: 34, caption: 'New recipe experiment in the kitchen! 🍳 Turned out delicious!' },
];

const ActionButton = ({ icon, count, onPress, isLiked = false }: { icon: string; count: number; onPress: () => void; isLiked?: boolean }) => {
  const iconName = isLiked ? 'heart' : icon;
  const iconColor = isLiked ? '#FF3040' : '#FFFFFF';

  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={iconName as any} size={32} color={iconColor} />
      <Text style={styles.actionCount}>{formatCount(count)}</Text>
    </TouchableOpacity>
  );
};

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const Item = ({ item, shouldPlay, videoHeight, videoIndex }: {shouldPlay: boolean; item: string; videoHeight: number; videoIndex: number}) => {
  const player = useVideoPlayer(item, (player) => {
    player.loop = true;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const data = videoData[videoIndex];

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [shouldPlay, player]);

  const handleVideoPress = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleCaption = () => {
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  return (
    <View style={[styles.videoContainer, { height: videoHeight }]}>
      <Pressable onPress={handleVideoPress} style={styles.videoWrapper}>
        <VideoView 
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </Pressable>
      
      {/* Right side actions */}
      <View style={styles.rightActions}>
        <ActionButton
          icon="heart-outline"
          count={data.likes + (isLiked ? 1 : 0)}
          onPress={handleLike}
          isLiked={isLiked}
        />
        <ActionButton
          icon="chatbubble-outline"
          count={data.comments}
          onPress={() => {}}
        />
        <ActionButton
          icon="share-outline"
          count={data.shares}
          onPress={() => {}}
        />
      </View>

      {/* Left side user info and caption */}
      <View style={styles.leftInfo}>
        <View style={styles.userInfo}>
          <Image source={{ uri: data.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{data.username}</Text>
        </View>
        <TouchableOpacity onPress={toggleCaption} activeOpacity={0.7}>
          <Text 
            style={styles.caption} 
            numberOfLines={isCaptionExpanded ? undefined : 2}
          >
            <Text style={styles.usernameInline}>{data.username} </Text>
            {data.caption}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Item item={item} shouldPlay={index === currentViewableItemIndex} videoHeight={videoHeight} videoIndex={index} />
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
    backgroundColor: '#000',
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  leftInfo: {
    position: 'absolute',
    bottom: 120,
    left: 12,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  usernameInline: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
  },
});
