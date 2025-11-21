import { SparkButton } from '@/components/spark-button';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

// Mock comments data for each video
const commentsData = [
  [
    { id: '1', username: 'nature_lover', avatar: 'https://i.pravatar.cc/150?img=10', comment: 'This is absolutely breathtaking! Where was this taken?', likes: 45, timeAgo: '2h' },
    { id: '2', username: 'traveler_joe', avatar: 'https://i.pravatar.cc/150?img=11', comment: 'Wow! The colors are amazing 🌅', likes: 23, timeAgo: '3h' },
    { id: '3', username: 'photo_fan', avatar: 'https://i.pravatar.cc/150?img=12', comment: 'Perfect timing for the sunset shot!', likes: 67, timeAgo: '4h' },
    { id: '4', username: 'mountain_climber', avatar: 'https://i.pravatar.cc/150?img=13', comment: 'Been there! The view is even better in person', likes: 12, timeAgo: '5h' },
    { id: '5', username: 'sunset_chaser', avatar: 'https://i.pravatar.cc/150?img=14', comment: 'Adding this to my bucket list!', likes: 89, timeAgo: '6h' },
  ],
  [
    { id: '1', username: 'hiker_pro', avatar: 'https://i.pravatar.cc/150?img=15', comment: 'How long was the hike? Looks challenging!', likes: 34, timeAgo: '1h' },
    { id: '2', username: 'adventure_seeker', avatar: 'https://i.pravatar.cc/150?img=16', comment: 'The view is worth every step! 💪', likes: 56, timeAgo: '2h' },
    { id: '3', username: 'trail_master', avatar: 'https://i.pravatar.cc/150?img=17', comment: 'What trail is this? Need to check it out!', likes: 78, timeAgo: '3h' },
    { id: '4', username: 'outdoor_life', avatar: 'https://i.pravatar.cc/150?img=18', comment: 'Amazing! How was the weather?', likes: 45, timeAgo: '4h' },
  ],
  [
    { id: '1', username: 'dev_coder', avatar: 'https://i.pravatar.cc/150?img=19', comment: 'What are you building? Looks interesting!', likes: 12, timeAgo: '30m' },
    { id: '2', username: 'tech_enthusiast', avatar: 'https://i.pravatar.cc/150?img=20', comment: 'Coffee and code - the perfect combo ☕️', likes: 34, timeAgo: '1h' },
    { id: '3', username: 'programmer_life', avatar: 'https://i.pravatar.cc/150?img=21', comment: 'Same energy! What language are you using?', likes: 23, timeAgo: '2h' },
  ],
  [
    { id: '1', username: 'beach_bum', avatar: 'https://i.pravatar.cc/150?img=22', comment: 'Perfect beach day! Wish I was there 🏖️', likes: 67, timeAgo: '1h' },
    { id: '2', username: 'summer_vibes', avatar: 'https://i.pravatar.cc/150?img=23', comment: 'The water looks so clear!', likes: 45, timeAgo: '2h' },
    { id: '3', username: 'vacation_mode', avatar: 'https://i.pravatar.cc/150?img=24', comment: 'Where is this? Need to visit!', likes: 89, timeAgo: '3h' },
    { id: '4', username: 'ocean_lover', avatar: 'https://i.pravatar.cc/150?img=25', comment: 'Beautiful! The weather looks perfect', likes: 56, timeAgo: '4h' },
  ],
  [
    { id: '1', username: 'foodie_lover', avatar: 'https://i.pravatar.cc/150?img=26', comment: 'That looks delicious! Can you share the recipe?', likes: 123, timeAgo: '1h' },
    { id: '2', username: 'cooking_master', avatar: 'https://i.pravatar.cc/150?img=27', comment: 'What ingredients did you use?', likes: 67, timeAgo: '2h' },
    { id: '3', username: 'chef_in_making', avatar: 'https://i.pravatar.cc/150?img=28', comment: 'I need to try this! Looks amazing 🍳', likes: 89, timeAgo: '3h' },
    { id: '4', username: 'recipe_hunter', avatar: 'https://i.pravatar.cc/150?img=29', comment: 'Please post the full recipe!', likes: 145, timeAgo: '4h' },
  ],
];

const profiles = {
  adam_nemeth: {
    name: 'Adam Nemeth',
    title: 'Psychologist',
    quote: '“Exploring how to react to our own thoughts and experiences with curiosity, kindness and compassion is an extraordinary thing to do.”',
    focusAreas: ['Anxiety', 'Diversity & inclusion', 'High sensitivity', 'Neurodiversity', 'Sexuality'],
    bio: 'Adam creates a safe and welcoming space where you can be fully yourself. He draws from his broad experience working with people from all walks of life to help you navigate life’s challenges. Whether you’re dealing with anxiety, exploring your identity, or feeling overwhelmed, Adam offers gentle guidance and practical tools. He believes in the power of self-compassion and helps you understand yourself better. With his background in crisis counselling and inclusive practices, Adam supports you in building resilience and finding your own path forward.',
    education: [
      'Psychology Degree, Hungary',
      'Postgraduate Degree in Crisis Counselling',
      'Training in Affirmative Practices for Gender and Sexual Minorities',
      'Training in Neuro-affirmative Work',
    ],
    approaches: ['Acceptance and Commitment Therapy (ACT)', 'Solution-focused Coaching/Counseling', 'Compassion Focused Therapy'],
    workingStyle:
      'Adam strikes a good balance between structure and flexibility in his sessions. He takes a gentle approach while helping you set clear goals for yourself. You’ll learn practical skills and gain helpful insights about your thoughts and feelings. Adam often includes homework to support your progress between sessions. His style is neither too formal nor too casual, creating a comfortable space where you feel understood and supported.',
    portrait: 'https://openup.com/wp-content/uploads/2023/02/Adam-Nemeth.png',
  },
} as const;

// Mock data for each video
const videoData = [
  {
    username: 'Adam Nemeth',
    profileId: 'adam_nemeth',
    avatar: 'https://openup.com/wp-content/uploads/2023/02/Adam-Nemeth.png',
    likes: 1234,
    comments: 56,
    shares: 12,
    caption: 'Exploring how curiosity, kindness, and compassion help us grow every day. 💫',
  },
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

const CommentItem = ({ comment }: { comment: typeof commentsData[0][0] }) => {
  return (
    <View style={styles.commentItem}>
      <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{comment.username}</Text>
          <Text style={styles.commentTime}>{comment.timeAgo}</Text>
        </View>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentLikeButton}>
            <Ionicons name="heart-outline" size={16} color="#666" />
            <Text style={styles.commentLikeCount}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentReplyButton}>
            <Text style={styles.commentReplyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Item = ({
  item,
  shouldPlay,
  videoHeight,
  videoIndex,
  onOpenComments,
  onOpenProfile,
}: {
  shouldPlay: boolean;
  item: string;
  videoHeight: number;
  videoIndex: number;
  onOpenComments: (index: number) => void;
  onOpenProfile: (profileId: string) => void;
}) => {
  const player = useVideoPlayer(item, (player) => {
    player.loop = true;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const overlayOpacity = useSharedValue(0);
  const hideOverlayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = videoData[videoIndex];

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [shouldPlay, player]);

  const clearOverlayTimeout = useCallback(() => {
    if (hideOverlayTimeout.current) {
      clearTimeout(hideOverlayTimeout.current);
      hideOverlayTimeout.current = null;
    }
  }, []);

  const showOverlay = useCallback(() => {
    clearOverlayTimeout();
    setShowPlayOverlay(true);
    overlayOpacity.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.ease),
    });
  }, [overlayOpacity, clearOverlayTimeout]);

  const hideOverlay = useCallback(
    (delay = 0) => {
      const animateHide = () => {
        overlayOpacity.value = withTiming(
          0,
          {
            duration: 220,
            easing: Easing.out(Easing.ease),
          },
          () => {
            runOnJS(setShowPlayOverlay)(false);
          }
        );
      };

      if (delay > 0) {
        clearOverlayTimeout();
        hideOverlayTimeout.current = setTimeout(animateHide, delay);
      } else {
        animateHide();
      }
    },
    [overlayOpacity, clearOverlayTimeout]
  );

  useEffect(() => {
    clearOverlayTimeout();
    setShowPlayOverlay(false);
    overlayOpacity.value = 0;
  }, [shouldPlay, clearOverlayTimeout, overlayOpacity]);

  useEffect(() => {
    return () => {
      clearOverlayTimeout();
    };
  }, [clearOverlayTimeout]);

  const handleVideoPress = () => {
    if (player.playing) {
      player.pause();
      showOverlay();
    } else {
      player.play();
      hideOverlay(200);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleCaption = () => {
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  const handleCommentsPress = () => {
    onOpenComments(videoIndex);
  };

  const handleProfilePress = () => {
    if (data.profileId) {
      onOpenProfile(data.profileId);
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `${data.username}: ${data.caption}\n\n${item}`,
        url: item,
        title: `Video by ${data.username}`,
      };
      
      const result = await Share.share(shareContent);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <View style={[styles.videoContainer, { height: videoHeight }]}>
      <Pressable onPress={handleVideoPress} style={styles.videoWrapper}>
        <VideoView 
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
        {showPlayOverlay && (
          <Animated.View pointerEvents="none" style={[styles.playOverlay, overlayAnimatedStyle]}>
            <View style={styles.playButtonContainer}>
              <Ionicons name="play" size={40} color="#FFFFFF" style={styles.playIcon} />
            </View>
          </Animated.View>
        )}
      </Pressable>
      
      {/* Right side actions */}
      <View style={styles.rightActions}>
        <SparkButton
          icon="heart-outline"
          count={data.likes + (isLiked ? 1 : 0)}
          onPress={handleLike}
          isLiked={isLiked}
          primaryColor="#FF3040"
          secondaryColor="#FF6B6B"
        />
        <ActionButton
          icon="chatbubble-outline"
          count={data.comments}
          onPress={handleCommentsPress}
        />
        <ActionButton
          icon="share-outline"
          count={data.shares}
          onPress={handleShare}
        />
      </View>

      {/* Left side user info and caption */}
      <View style={styles.leftInfo}>
        <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress} activeOpacity={0.8}>
          <Image source={{ uri: data.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{data.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCaption} activeOpacity={0.7}>
          <Text 
            style={styles.caption} 
            numberOfLines={isCaptionExpanded ? undefined : 2}
          >
            {data.caption}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const [currentCommentsIndex, setCurrentCommentsIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSheetRef = useRef<BottomSheet>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
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

  const handleOpenComments = useCallback((index: number) => {
    setCurrentCommentsIndex(index);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseComments = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenProfile = useCallback((profileId: string) => {
    if (profiles[profileId as keyof typeof profiles]) {
      setSelectedProfileId(profileId);
    }
  }, []);

  const handleCloseProfile = useCallback(() => {
    profileSheetRef.current?.close();
    setSelectedProfileId(null);
  }, []);

  const renderCommentItem = useCallback(({ item }: { item: typeof commentsData[0][0] }) => {
    return <CommentItem comment={item} />;
  }, []);

  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const profileSnapPoints = useMemo(() => ['60%'], []);

  const currentComments = commentsData[currentCommentsIndex] || [];
  const selectedProfile = selectedProfileId ? profiles[selectedProfileId as keyof typeof profiles] : null;

  useEffect(() => {
    if (selectedProfileId) {
      profileSheetRef.current?.expand();
    }
  }, [selectedProfileId]);
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            shouldPlay={index === currentViewableItemIndex}
            videoHeight={videoHeight}
            videoIndex={index}
            onOpenComments={handleOpenComments}
            onOpenProfile={handleOpenProfile}
          />
        )}
        keyExtractor={item => item}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        getItemLayout={getItemLayout}
        decelerationRate="fast"
      />
    
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetIndicator}
    >
      <View style={styles.bottomSheetHeader}>
        <Text style={styles.bottomSheetTitle}>Comments</Text>
        <TouchableOpacity onPress={handleCloseComments}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <BottomSheetFlatList
        data={currentComments}
        renderItem={renderCommentItem}
        keyExtractor={(item: typeof commentsData[0][0]) => item.id}
        contentContainerStyle={styles.commentsList}
      />
    </BottomSheet>

    <BottomSheet
      ref={profileSheetRef}
      index={-1}
      snapPoints={profileSnapPoints}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetIndicator}
      onClose={() => setSelectedProfileId(null)}
    >
      {selectedProfile ? (
        <ScrollView contentContainerStyle={styles.profileSheetContent}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: selectedProfile.portrait }} style={styles.profilePortrait} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{selectedProfile.name}</Text>
              <Text style={styles.profileTitle}>{selectedProfile.title}</Text>
            </View>
            <TouchableOpacity onPress={handleCloseProfile}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileChipContainer}>
            {selectedProfile.focusAreas.map(area => (
              <View key={area} style={styles.profileChip}>
                <Text style={styles.profileChipText}>{area}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.profileParagraph}>{selectedProfile.bio}</Text>

          <Text style={styles.profileSectionTitle}>Educational background</Text>
          {selectedProfile.education.map(item => (
            <Text key={item} style={styles.profileListItem}>
              • {item}
            </Text>
          ))}

          <Text style={styles.profileSectionTitle}>Preferred therapeutic approach</Text>
          {selectedProfile.approaches.map(item => (
            <Text key={item} style={styles.profileListItem}>
              • {item}
            </Text>
          ))}

          <Text style={styles.profileSectionTitle}>Working style</Text>
          <Text style={styles.profileParagraph}>{selectedProfile.workingStyle}</Text>

          <Text style={styles.profileQuote}>{selectedProfile.quote}</Text>
        </ScrollView>
      ) : (
        <View style={styles.profileSheetContent}>
          <Text style={styles.profileName}>Profile unavailable</Text>
        </View>
      )}
    </BottomSheet>
    </GestureHandlerRootView>
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
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(26, 26, 26, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginLeft: 4,
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
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  bottomSheetIndicator: {
    backgroundColor: '#CCCCCC',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profilePortrait: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  profileTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileChipText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  profileListItem: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  profileParagraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2937',
  },
  profileQuote: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#475569',
    borderLeftWidth: 3,
    borderLeftColor: '#94A3B8',
    paddingLeft: 12,
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeCount: {
    fontSize: 12,
    color: '#666',
  },
  commentReplyButton: {
    paddingVertical: 4,
  },
  commentReplyText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
