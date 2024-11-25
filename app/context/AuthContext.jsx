import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/data/axios";
import useSocket from "../../hooks/common/useSocket";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to provide authentication context
export const AuthProvider = ({ children }) => {
  const isFetchingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    userId: "",
    storeId: "",
    addressId: "",
    storeName: "",
    header_address: "",
    sub_region: "",
    sub_province: "",
    sub_city: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    username: "",
    mobile_number: "",
    email: "",
    firstname: "",
    middlename: "",
    lastname: "",
    fullname: "",
    user_type: "",
  });

  const { socket, error } = useSocket(userDetails);

  const fetchUserDetails = async (token) => {
    if (!token || isFetchingRef.current) return; // Prevent duplicate fetches

    isFetchingRef.current = true; // Mark fetch as ongoing
    try {
      const response = await api.get(`/mobile-users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const user = response.data.data;

        setUserDetails({
          userId: user.id,
          storeId: user.store_id,
          addressId: user.address_id,
          storeName: user.store_name,
          header_address: user.header_address,
          sub_region: user.sub_region,
          sub_province: user.sub_province,
          sub_city: user.sub_city,
          postal_code: user.postal_code,
          latitude: user.latitude,
          longitude: user.longitude,
          username: user.username,
          mobile_number: user.mobile_number,
          email: user.email,
          firstname: user.first_name,
          middlename: user.middle_name,
          lastname: user.last_name,
          fullname: `${user.first_name} ${user.middle_name || ""} ${
            user.last_name
          }`,
          user_type: user.user_type,
        });
      } else {
        // console.error("Error fetching user details:", response.data.message);
      }
    } catch (error) {
      // console.error("Error fetching user details:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        await fetchUserDetails(token); // Fetch user details with the token
      }
    } catch (error) {
      console.error("Error loading user token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = async () => {
    try {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
      await AsyncStorage.removeItem("accessToken");
      setUserDetails({});
      setIsLoading(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const logout = async () => {
  //   try {
  //     await AsyncStorage.removeItem("accessToken");
  //     setUserDetails({});
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  const value = {
    userDetails,
    setUser: setUserDetails,
    isLoading,
    setIsLoading,
    fetchUserDetails,
    logout,
    socket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuth;
