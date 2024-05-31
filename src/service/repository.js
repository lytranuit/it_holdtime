import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
});
/**
 * Catch the AunAuthorized Request
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error);
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem("me");
      localStorage.removeItem("Auth-Token");
      location.reload();
    }
  }
);
export default instance;
