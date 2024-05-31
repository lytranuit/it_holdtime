import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "admin";
const area = "holdtime";
export default {
  HomeBadge() {
    return repository.get(`/${area}/${resoure}/HomeBadge`, { headers: authHeader() }).then((res) => res.data);
  },
  table1(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/table1`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
  table2(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/table2`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  }
};
