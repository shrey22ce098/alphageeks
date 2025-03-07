// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:5000/api",
// });


import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",  // ✅ Ensure correct backend URL
  headers: { "Content-Type": "application/json" }
});

export default instance;
