import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { APIURL, HeadersToken } from "../Constants";

const ReviewShopScreen = ({ route }) => {
  const { shopId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);

  const responseMock = [
    {
      reviewId: 1,
      rating: 3,
      comment: "CleanAndGood",
      requester: {
        username: "Requester1",
        profilePicture: "",
      },
    },
    {
      reviewId: 2,
      rating: 5,
      comment:
        "EieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieieEieieieieiieieieeiieieieieiieieieiieieieieieieiieieie",
      requester: {
        username: "Requester2",
        profilePicture: "",
      },
    },
  ];
  const fetchReview = async () => {
    try {
      const response = await axios.get(`${APIURL}shop/review`, {
        params: { shopId: shopId },
        ...HeadersToken,
      });
      // setReviews(response.data);
      setReviews(responseMock);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const renderReviewed = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => {
        setSelectedReview(item);
        setModalVisible(true);
      }}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ width: 52, height: 52 }}>
          {item.requester.profilePicture ? (
            <Image
              source={{ uri: item.requester.profilePicture }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 8,
                alignSelf: "center",
              }}
            />
          ) : null}
        </View>
        <Entypo name="star-outlined" size={20} color="black" />
        <View style={{ gap: 8 }}>
          <Text style={styles.restaurantName}>{item.rating}</Text>

          <Text
            style={{ fontSize: 14, color: "grey" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.comment}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleClose = () => {
    setModalVisible(false);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, top: 0, backgroundColor: "white" }}>
      <Header
        title={"รีวิว: ร้านที่ " + shopId.toString()}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <FlatList
          data={reviews}
          renderItem={renderReviewed}
          keyExtractor={(item) => item.reviewId.toString()}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={handleClose}
        >
          <View style={styles.fullScreenModal}>
            <Header
              title="รายละเอียดรีวิว"
              showBackButton={true}
              onBackPress={handleClose}
            />
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.profileContainer}>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {selectedReview?.requester.profilePicture ? (
                    <Image
                      source={{ uri: selectedReview.requester.profilePicture }}
                      style={styles.profilePic}
                    />
                  ) : (
                    <View style={styles.placeholderPic} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.username}>
                      {selectedReview?.requester.username}
                    </Text>
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: 5 }, (_, index) => {
                        return (
                          <Entypo
                            key={index}
                            name={
                              index < selectedReview?.rating
                                ? "star"
                                : "star-outlined"
                            }
                            size={26}
                            color={
                              index < selectedReview?.rating ? "black" : "gray"
                            }
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.commentContainer}>
                <Text style={styles.username}>รีวิว</Text>
                <Text style={styles.comment}>{selectedReview?.comment}</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#fff",
  },
  restaurantItem: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  restaurantName: {
    fontSize: 18,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profilePic: {
    width: 69,
    height: 69,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderPic: {
    width: 69,
    height: 69,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    color: "#555",
    marginTop: 16,
  },
  commentContainer: {
    marginTop: 24,
    width: "100%",
    justifyContent: "flex-start",
  },
});

export default ReviewShopScreen;
