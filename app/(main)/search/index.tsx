import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { THEME } from "@/constants/theme";
import { useDebounce } from "@/hooks/useDebounce";

// Mock data
const hashtags = ["#ReactNative", "#Expo", "#MobileDev", "#Design"];
const posts = [
  { id: "1", content: "Building a search screen in Expo is fun! 🚀" },
  { id: "2", content: "React Native makes mobile dev smooth 💡" },
  { id: "3", content: "Expo Router feels like Next.js but for mobile" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400); // ✅ debounce input

  const filteredPosts = posts.filter((p) =>
    p.content.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={THEME.colors.grey2} />
        <TextInput
          placeholder="Search hashtags or posts"
          placeholderTextColor={THEME.colors.grey2}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
        {debouncedQuery.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={THEME.colors.grey2}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 🔹 Hashtags */}
      {debouncedQuery.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Hashtags</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={hashtags}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.hashtag}>
                <Text style={styles.hashtagText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 🔹 Posts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {debouncedQuery ? "Search Results" : "Recent Posts"}
        </Text>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.postText}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>No posts found</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: THEME.colors.dark,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: THEME.colors.dark,
  },
  hashtag: {
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
  },
  hashtagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  postCard: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    color: THEME.colors.dark,
  },
  noResults: {
    textAlign: "center",
    color: THEME.colors.grey2,
    marginTop: 20,
  },
});

export default Search;
