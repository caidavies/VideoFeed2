import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SparkButtonProps {
  icon: string;
  count: number;
  onPress: () => void;
  isLiked?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  iconSize?: number;
  animationSpeed?: number;
}

const PARTICLE_COUNT = 6;
const PARTICLE_DISTANCE = 60;

// Particle component
const Particle = ({
  id,
  angle,
  distance,
  color,
  animationSpeed,
  isActive,
  iconSize,
}: {
  id: number;
  angle: number;
  distance: number;
  color: string;
  animationSpeed: number;
  isActive: boolean;
  iconSize: number;
}) => {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      progress.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(20 / animationSpeed, withTiming(1, {
          duration: 250 / animationSpeed,
          easing: Easing.out(Easing.ease),
        }))
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 0 }),
        withDelay(20 / animationSpeed, withTiming(1, {
          duration: 150 / animationSpeed,
          easing: Easing.out(Easing.ease),
        })),
        withTiming(0, {
          duration: 100 / animationSpeed,
          easing: Easing.in(Easing.ease),
        })
      );
    } else {
      progress.value = 0;
      opacity.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, animationSpeed]);

  const animatedStyle = useAnimatedStyle(() => {
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * distance * progress.value;
    const y = Math.sin(radians) * distance * progress.value;
    const scale = progress.value > 0 ? Math.max(0, 1 - progress.value * 0.5) : 0;

    return {
      opacity: opacity.value,
      transform: [
        { translateX: x },
        { translateY: y },
        { scale },
      ],
    };
  });

  const particleTop = iconSize / 2 - 3; // Center on icon

  return (
    <Animated.View
      style={[
        styles.particle,
        { 
          backgroundColor: color,
          top: particleTop,
        },
        animatedStyle,
      ]}
    />
  );
};

export const SparkButton = ({
  icon,
  count,
  onPress,
  isLiked = false,
  primaryColor = '#FF3040',
  secondaryColor = '#FF6B6B',
  iconSize = 32,
  animationSpeed = 2,
}: SparkButtonProps) => {
  const iconScale = useSharedValue(1);
  const [showParticles, setShowParticles] = useState(false);
  const [currentColor, setCurrentColor] = useState(isLiked ? primaryColor : '#FFFFFF');
  const particleKey = useRef(0);

  useEffect(() => {
    setCurrentColor(isLiked ? primaryColor : '#FFFFFF');
  }, [isLiked, primaryColor]);

  const handlePress = () => {
    if (!isLiked) {
      // Animate when liking only
      iconScale.value = withSequence(
        withTiming(1.2, {
          duration: 60 / animationSpeed,
          easing: Easing.out(Easing.ease),
        }),
        withSpring(1, { damping: 12, stiffness: 500 })
      );

      // Show particles
      particleKey.current += 1;
      setShowParticles(true);

      // Hide particles after animation
      setTimeout(() => {
        setShowParticles(false);
      }, 300 / animationSpeed);

      // Change color
      setCurrentColor(primaryColor);
    } else {
      // No animation when unliking, just change color
      setCurrentColor('#FFFFFF');
    }

    onPress();
  };

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const iconName = isLiked ? 'heart' : icon;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handlePress}
        activeOpacity={0.7}>
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons name={iconName as any} size={iconSize} color={currentColor} />
        </Animated.View>
        <Text style={styles.actionCount}>{formatCount(count)}</Text>
      </TouchableOpacity>

      {/* Spark Particles */}
      {showParticles &&
        Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <Particle
            key={`${particleKey.current}-${i}`}
            id={i}
            angle={(i * 360) / PARTICLE_COUNT}
            distance={PARTICLE_DISTANCE}
            color={secondaryColor}
            animationSpeed={animationSpeed}
            isActive={showParticles}
            iconSize={iconSize}
          />
        ))}
    </View>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    left: '50%',
    marginLeft: -3,
  },
});
