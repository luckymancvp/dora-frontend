import axios from "axios";
import { flatten } from "lodash";
import { toast } from "react-toastify";

const LOGIN_PATH = "/login";

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/v1`,
});

client.interceptors.request.use(
  async config => {
    const token = localStorage.getItem("access_token");
    let headers = {
      ...config.headers,
      "Content-type": "application/json",
    };
    if (token) {
      headers = {
        ...headers,
        // Authorization: token,
        "PAMO-ACCESS-TOKEN": token,
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
      message = error.response.message;
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

    toast.error(message || "Error happened");
    if (error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = LOGIN_PATH;
    }
    return Promise.reject(error);
  },
);

export default client;
