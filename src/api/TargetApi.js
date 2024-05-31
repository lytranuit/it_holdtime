import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "Target";
const area = "holdtime";
export default {
  Save(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/Save`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },

  delete(id) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(
        `/${area}/${resoure}/Delete`,
        { id: id },
        {
          headers: headers,
        }
      )
      .then((res) => res.data);
  },
  table(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/Table`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
  get(id) {
    return repository
      .get(`/${area}/${resoure}/Get`, {
        params: { id: id },
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
  getList() {
    return repository
      .get(`/${area}/${resoure}/getList`, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
};
