import React, { useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Video from "react-native-video";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { height, width } = Dimensions.get("window");

const initialVideos = [
  { id: "1", url: "https://videos.pexels.com/video-files/4678261/4678261-hd_1080_1920_25fps.mp4" },
  { id: "2", url: "https://videos.pexels.com/video-files/4434242/4434242-uhd_1440_2560_24fps.mp4" },
  { id: "3", url: "https://videos.pexels.com/video-files/4434150/4434150-hd_1080_1920_30fps.mp4" },
  { id: "4", url: "https://videos.pexels.com/video-files/6010489/6010489-uhd_1440_2560_25fps.mp4" },
  { id: "5", url: "https://videos.pexels.com/video-files/4434286/4434286-hd_1080_1920_30fps.mp4" }
];

export default function ReelsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedVideos, setPausedVideos] = useState({});

  const LikeButton = () => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const onPress = () => {
      scale.value = withSpring(1.4, { damping: 4 }, () => {
        scale.value = withSpring(1);
      });
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <Animated.Text style={[styles.icon, animatedStyle]}>❤️</Animated.Text>
      </TouchableOpacity>
    );
  };

  const Overlay = () => (
    <View style={styles.overlay} pointerEvents="box-none">
      <LikeButton />
      <TouchableOpacity><Text style={styles.icon}>💬</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.icon}>📤</Text></TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.url }}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted
        paused={currentIndex !== index || pausedVideos[index]}
        controls={false}
      />

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() =>
          setPausedVideos((prev) => ({ ...prev, [index]: !prev[index] }))
        }
      />

      <Overlay />
    </View>
  );

  return (
    <FlashList
      data={initialVideos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={height}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const newIndex = Math.round(offsetY / height);
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
          setPausedVideos((prev) => ({ ...prev, [newIndex]: false }));
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width,
    height,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    marginVertical: 15,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
