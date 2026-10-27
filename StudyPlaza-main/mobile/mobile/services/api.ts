import {create} from "axios";

const api = create({
  baseURL: "http://192.168.105.83:3000",
});

export default api;