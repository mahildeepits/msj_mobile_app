import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import config from '../config';

export default function VideoComponent() {
  const videoUri = `${config.videoBaseUrl}`;
  const player = useVideoPlayer(videoUri, (player) => {
    player.play();
  });
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const subscription = player.addListener('playingChange', (status) => {
      setIsPlaying(status);
    });
    return () => subscription.remove();
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} allowsFullscreen />
      {/* <Button title={isPlaying ? 'Pause' : 'Play'} onPress={() => {
        isPlaying ? player.pause() : player.play();
        setIsPlaying(!isPlaying);
      }} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white', marginTop:20,padding:10 },
  video: { width: '100%', height: 240 }
});
