import authHeader from "../service/authHeader";
import repository from "../service/repository";

const resoure = "history";
const area = "v1";
export default {
  table(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/table`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
  export(params) {
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";
    return repository
      .post(`/${area}/${resoure}/exportexcel`, params, {
        headers: headers,
      })
      .then((res) => res.data);
  },
};
