import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "Hold";
const area = "Holdtime";
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
  SaveHoldTimeTargetModel(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/SaveHoldTimeTargetModel`, params, {
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
  table(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/table`, params, {
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
  
  getTime(id) {
    return repository
      .get(`/${area}/${resoure}/getTime`, {
        params: { id: id },
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
  getListAlert(id) {
    return repository
      .get(`/${area}/${resoure}/getListAlert`, {
        params: { id: id },
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
  getListTarget(id) {
    return repository
      .get(`/${area}/${resoure}/getListTarget`, {
        params: { id: id },
        headers: authHeader(),
      })
      .then((res) => res.data);
  },
  xuatexcel(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/xuatexcel`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
};
