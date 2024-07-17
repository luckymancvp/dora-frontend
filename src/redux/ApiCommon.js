import axios from "axios";
import { flatten } from "lodash";
import { toast } from "react-toastify";

const LOGIN_PATH = "/login";

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/v1`,
});

client.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    let headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    if (token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }
    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!response) {
      toast.error("No response from server");
      return Promise.reject(error);
    }

    let { message } = response.data;
    const {
      config: {
        headers: { ignoreApiAlertMsg },
      },
      data: { errors },
    } = response;

    if (ignoreApiAlertMsg) {
      return Promise.reject(error);
    }

    if (!message) {
      message = response.data;
    }

    if (!message && errors) {
      if (errors[0].message) {
        message = errors.map((e) => e.message);
      } else if (errors[0].messages) {
        message = flatten(errors.map((e) => e.messages));
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

    if (response.status === 413) {
      toast.error("Request entity too large");
    } else if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = LOGIN_PATH;
    } else {
      toast.error(message || "Error happened");
    }

    return Promise.reject(error);
  }
);

export default client;
