// // fakeAuth.js
// let fakeUser = { username: "admin", password: "123456", email: "admin@example.com" };
// let fakeToken = "fake-jwt-token";

// export const fakeLogin = ({ username, password }) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if ((username === fakeUser.username || username === fakeUser.email) && password === fakeUser.password) {
//         resolve({ user: { username: fakeUser.username, email: fakeUser.email }, accessToken: fakeToken });
//       } else {
//         reject({ message: "Sai tài khoản hoặc mật khẩu" });
//       }
//     }, 500); // giả lập network delay
//   });
// };
