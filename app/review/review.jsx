import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import COLORS from "../../constants/colors";
import { route, useNavigation } from "expo-router";
import useAuth from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { fonts } from "../../constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import {
  createFeedbackAndReview,
  createNewServiceReuqest,
} from "../../data/api/postApi";
import QRCode from "react-native-qrcode-svg";
import { StarRating } from "../../components/StarRating";

export default function Review() {
  const { userDetails } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { service_request_id } = route.params;
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (value) => {
    switch (field) {
      case "rating":
        setRating(value);
        break;
      case "comment":
        setComment(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const reviewData = {
      store_id: userDetails.storeId,
      user_id: userDetails.userId,
      service_request_id: service_request_id,
      rating: rating,
      comment: comment,
    };

    setLoading(true);

    console.log(reviewData);

    try {
      const response = await createFeedbackAndReview(reviewData);

      if (response.success) {
        navigation.goBack();
      } else {
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSelected = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <View style={{ marginTop: 10 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                marginTop: 15,
                fontSize: 22,
                fontFamily: fonts.Bold,
                marginVertical: 12,
                color: COLORS.primary,
              }}
            >
              Leave Feedback and Review
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.Regular,
                color: COLORS.primary,
              }}
            >
              Rate your experience and provide comment
            </Text>
          </View>

          <View style={styles.contentContainer}>
            {/* Customer Rating */}
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <Text style={styles.paymentTitle}>Rate your experience</Text>
              <View style={{}}>
                <StarRating onRatingSelected={handleRatingSelected} />
              </View>
              {/* Optional: Display the current rating or any other relevant information */}
              {rating > 0 && (
                <Text style={styles.ratingText}>
                  You rated: {rating} star{rating > 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Your Feedback */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.notesLabel}>Your Feedback</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter your comment..."
                multiline
                onChangeText={handleInputChange("comment")}
              />
            </View>
          </View>
        </View>
        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  container_sub: {
    flex: 1,
    marginHorizontal: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
    marginLeft: 5,
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  serviceBox: {
    backgroundColor: COLORS.secondary_light,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  serviceTitle: {
    fontFamily: fonts.Bold,
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: "center",
  },
  serviceDescription: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.subtitle,
    marginBottom: 15,
  },
  input: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  paymentTitle: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 5,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  paymentButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selectedPaymentButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  paymentText: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  selectedPaymentText: {
    color: COLORS.white,
  },
  notesLabel: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 5,
    marginTop: 10,
  },
  notesInput: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
    textAlign: "left", // Aligns text to the left
    textAlignVertical: "top", // Aligns text to the top for multiline
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: fonts.Bold,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalText: {
    fontFamily: fonts.Regular,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    fontFamily: fonts.SemiBold,
    color: COLORS.white,
    fontSize: 16,
  },
  ratingText: {
    fontFamily: fonts.Regular,
    marginTop: 15,
    fontSize: 16,
    color: "#555",
  },
});
