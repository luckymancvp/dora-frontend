import axios from "axios";
import { flatten } from "lodash";
import { toast } from "react-toastify";

const LOGIN_PATH = "/login";

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/v1`,
});

client.interceptors.request.use(
  async config => {
    const token = localStorage.getItem("token");
    let headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    if (token) {
      headers = {
        ...headers,
        // Authorization: token,
        // "PAMO-ACCESS-TOKEN": token,
      };
    }
    config.headers = headers;
    return config;
  },
  error => Promise.reject(error),
);

client.interceptors.response.use(
  response => response,
  error => {
    let {
      data: { message },
    } = error.response;
    const {
      config: { headers: { ignoreApiAlertMsg } },
      data: { errors },
    } = error.response;
    if (ignoreApiAlertMsg) {
      return Promise.reject(error);
    }
    if (!message) {
      message = error.response.data;
    }

    if (!message && errors) {
      if (errors[0].message) {
        message = errors.map(e => e.message);
      } else if (errors[0].messages) {
        message = flatten(errors.map(e => e.messages));
      } else {
        message = errors;
      }
    }

    if (message && Array.isArray(message)) {
      message = message.join(",");
    }

    if (message && typeof message === "object") {
      return Promise.reject(error);
    }

    toast.error("Error happened");
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = LOGIN_PATH;
    }
    return Promise.reject(error);
  },
);

export default client;
