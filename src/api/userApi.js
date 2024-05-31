import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "user";
const area = "v1";
export default {
  get(id) {
    return repository
      .get(`/${area}/${resoure}/get/${id}`, { headers: authHeader() })
      .then((res) => res.data);
  },
  users() {
    return repository
      .get(`/${area}/${resoure}/users`, { headers: authHeader() })
      .then((res) => res.data);
  },
  departments() {
    return repository
      .get(`/${area}/${resoure}/departments`, { headers: authHeader() })
      .then((res) => res.data);
  },
  roles() {
    return repository
      .get(`/${area}/${resoure}/roles`, { headers: authHeader() })
      .then((res) => res.data);
  },
  updateObject(formData) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/updateObject`, formData, { headers: headers })
      .then((res) => res.data);
  },
  create(formData) {
    return repository
      .post(`/${area}/${resoure}/create`, formData, { headers: authHeader() })
      .then((res) => res.data);
  },
  edit(formData) {
    return repository
      .post(`/${area}/${resoure}/edit`, formData, { headers: authHeader() })
      .then((res) => res.data);
  },
  changepassword(formData) {
    return repository
      .post(`/${area}/${resoure}/changepassword`, formData, {
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
  excel() {
    return repository
      .post(`/${area}/${resoure}/excel`, { headers: authHeader() })
      .then((res) => res.data);
  },
  sync() {
    return repository
      .post(`/${area}/${resoure}/sync`, { headers: authHeader() })
      .then((res) => res.data);
  },
  table(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/table`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
  delete(id) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(
        `/${area}/${resoure}/delete`,
        { id: id },
        {
          headers: headers,
        }
      )
      .then((res) => res.data);
  },
};
