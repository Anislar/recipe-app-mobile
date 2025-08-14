import { ScrollView, FlatList, StyleSheet } from "react-native";

import { ScreenWrapper, CategoryItem, PostCard } from "@/components";
import { categories } from "@/helpers/post/utils";

const HomePage = () => {
  return (
    <ScreenWrapper bg="white">
      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={"general" === category.id}
            onPress={() => {}}
          />
        ))}
      </ScrollView>

      {/* Posts */}
      <FlatList
        data={[
          {
            id: 1,
            user: {
              name: "Sarah Chen",
              username: "@sarahc",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            content:
              "Just finished an amazing hiking trail! The view was absolutely breathtaking 🌄",
            image: "https://picsum.photos/400/300?random=1",
            category: "travel",
            likes: 124,
            comments: 18,
            time: "2h",
            liked: false,
          },
          {
            id: 2,
            user: {
              name: "Alex Rodriguez",
              username: "@alexr",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            content: "Coffee and code - perfect Sunday morning combo ☕️💻",
            category: "tech",
            likes: 89,
            comments: 12,
            time: "4h",
            liked: true,
          },
          {
            id: 3,
            user: {
              name: "Maya Patel",
              username: "@mayap",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            content:
              "New art piece finished! Mixed media on canvas. What do you think?",
            image: "https://picsum.photos/400/300?random=2",
            category: "art",
            likes: 156,
            comments: 24,
            time: "6h",
            liked: false,
          },
          {
            id: 4,
            user: {
              name: "John Smith",
              username: "@johns",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            },
            content: "Amazing pasta at this new Italian restaurant! 🍝✨",
            image: "https://picsum.photos/400/300?random=3",
            category: "food",
            likes: 78,
            comments: 9,
            time: "8h",
            liked: false,
          },
        ]}
        renderItem={({ item }) => <PostCard post={item as any} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.postsList}
      />
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  categoriesContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  postsList: {
    flex: 1,
  },
});
export default HomePage;
