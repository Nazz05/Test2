// import axios from "axios";

// const BASE_URL = "http://localhost:8080/api";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 5000,
// });

// // Test functions
// export const testAPIs = async () => {
//   try {
//     console.log("=== Testing Backend APIs ===\n");

//     // Test 1: Register
//     console.log("1. Testing POST /auth/register...");
//     const registerRes = await apiClient.post("/auth/register", {
//       username: "testuser",
//       email: "test@example.com",
//       password: "password123",
//     });
//     console.log("✓ Register successful:", registerRes.data);
//     const token = registerRes.data.token;

//     // Test 2: Login
//     console.log("\n2. Testing POST /auth/login...");
//     const loginRes = await apiClient.post("/auth/login", {
//       username: "testuser",
//       password: "password123",
//     });
//     console.log("✓ Login successful:", loginRes.data);
//     const authToken = loginRes.data.token;

//     // Test 3: Validate Token
//     console.log("\n3. Testing POST /auth/validate...");
//     const validateRes = await apiClient.post(
//       "/auth/validate",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     console.log("✓ Token validation:", validateRes.data);

//     // Test 4: Get User Info
//     console.log("\n4. Testing GET /users/{id}...");
//     const userRes = await apiClient.get("/users/1", {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     console.log("✓ User info:", userRes.data);

//     console.log("\n=== All tests passed! ===");
//     return true;
//   } catch (error) {
//     console.error("✗ Test failed:", error.response?.data || error.message);
//     return false;
//   }
// };

// // Run tests
// testAPIs();
