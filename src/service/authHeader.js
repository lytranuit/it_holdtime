export default function authHeader() {
  let user = JSON.parse(localStorage.getItem("me"));
  let Token = localStorage.getItem("Auth-Token");
  // console.log(Token);
  if (user && Token) {
    return { Authorization: "Bearer " + Token };
  } else {
    return {};
  }
}
