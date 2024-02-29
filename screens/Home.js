import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { storage } from "../firebaseConfig";

export default function Home() {
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const listRef = ref(storage, "Medias/");

      try {
        const result = await listAll(listRef);
        const mediaUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const type =
              itemRef.contentType && itemRef.contentType.startsWith("video/")
                ? "video"
                : "image";
            return {
              url,
              type,
            };
          })
        );

        setMedias(mediaUrls);
      } catch (error) {
        console.error("Error listing files:", error);
      }
    };

    fetchMedia();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={2}
        data={medias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          // Pour rendre les images cliquable
          <TouchableOpacity>
            <View style={styles.itemContainer}>
              {item.type === "image" ? (
                <Image
                  source={{ uri: item.url }}
                  style={styles.mediaThumbnail}
                />
              ) : (
                <Video
                  source={{ uri: item.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  style={styles.mediaThumbnail}
                  useNativeControls
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  mediaThumbnail: {
    width: Dimensions.get("window").width / 2 - 10, // Adjusted width to fit two items in a row
    height: Dimensions.get("window").width / 2 - 10, // Adjusted height to fit two items in a row
    borderRadius: 8,
  },
});
