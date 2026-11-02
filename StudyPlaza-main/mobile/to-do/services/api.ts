import {create} from "axios";

const api = create({
  baseURL: "http://192.168.3.9:3000",
});

export default api;