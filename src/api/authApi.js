import repository from "../service/repository";

const resoure = "auth";
const area = "v1";
export default {
  logout() {
    return repository
      .post(`/${area}/${resoure}/Logout`)
      .then((res) => res.data);
  },
  TokenInfo(token) {
    return repository
      .get(`/${area}/${resoure}/TokenInfo?token=${token}`)
      .then((res) => res.data);
  },

  login(params) {
    return repository
      .post(`/${area}/${resoure}/Login`, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  },
};
