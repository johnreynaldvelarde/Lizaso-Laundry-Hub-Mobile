import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://192.168.254.162:3002/api";
// const BASE_URL = "http://192.168.254.139:3002/api";
//const BASE_URL = "http://192.168.254.107:3002/api";

// Create an instance of axios
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Timeout set to 5 seconds
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("accessToken"); // Ensure the key matches what you use
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request Interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Example: Add a token to every request
//     const token = "your-token-here"; // Replace with actual token logic
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response; // Return only the data from the response
  },
  (error) => {
    // Handle any errors
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );
    return Promise.reject(error); // Pass error to the calling function
  }
);

// import axios from "axios";
// const API_URL = "http://localhost:3002/api";

// export const axiosPrivate = axios.create({
//   baseURL: API_URL,
// });

// import axios from "axios";

// const BASE_URL = "http://192.168.254.162:3002/api";

// export const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 5000,
// });
[
  {
    address_id: 1,
    address_line1: "Balagtas",
    address_line2: "Bulacan",
    address_updated_at: "2024-10-19T13:15:27.000Z",
    city: "Balagtas",
    country: "Philippines",
    date_created: "2024-10-19T13:15:27.000Z",
    id: 1,
    isArchive: 0,
    isStatus: 0,
    is_main_store: 1,
    latitude: "14.814821",
    longitude: "120.911270",
    postal_code: "3016",
    province: "Bulacan",
    store_contact: "Main Contact",
    store_email: "",
    store_name: "Lizaso Laundry Hub",
    store_no: "LIZASO-1729343727423",
    store_updated_at: null,
  },
];
