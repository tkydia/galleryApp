import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { storage } from "../firebaseConfig";

export default function Home() {
  // Etat pour stocker localement les urls des videos
  const [videos, setVideos] = useState([]);

  // Fonction pour recup les urls de firebase
  useEffect(() => {
    const fetchVideos = async () => {
      const listRef = ref(storage, "Medias/");

      // Liste toutes les videos et retourne l'url
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

        // Mise a jour de l'etat local (const [videos, setVideos] = useState([]);)
        setVideos(videoUrls);
      } catch (error) {
        console.error("Error listing videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Affiche l'ensemble des videos dans la flatlist */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <Video
            source={{ uri: item.url }}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{ width: "48%", height: 200 }}
            useNativeControls
          />
        )}
        // Styles de la flatlist
        numColumns={2}
        contentContainerStyle={{ gap: 2 }}
        columnWrapperStyle={{ gap: 2 }}
      />
    </View>
  );
}
