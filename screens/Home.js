import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { storage } from "../firebaseConfig";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const listRef = ref(storage, "Medias/");

      try {
        const result = await listAll(listRef);
        const videoUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);

            return {
              url,
            };
          })
        );

        setVideos(videoUrls);
      } catch (error) {
        console.error("Error listing videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <Video
            source={{ uri: item.url }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            style={{ width: "48%", height: 100 }}
            useNativeControls
          />
        )}
        numColumns={2}
        contentContainerStyle={{ gap: 2 }}
        columnWrapperStyle={{ gap: 2 }}
      />
    </View>
  );
}
