import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "api";
const area = "holdtime";
export default {
  targets() {
    return repository
      .get(`/${area}/${resoure}/targets`, { headers: authHeader() })
      .then((res) => res.data);
  },

  stages() {
    return repository
      .get(`/${area}/${resoure}/stages`, { headers: authHeader() })
      .then((res) => res.data);
  },
  departments() {
    return repository
      .get(`/v1/${resoure}/departments`, { headers: authHeader() })
      .then((res) => res.data);
  },

};
