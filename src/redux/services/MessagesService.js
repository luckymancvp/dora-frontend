import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

const fetchMessages = (conversationId) => api
  .get(`/messages/${conversationId}`)
  .then(response => camelCaseObject(response));

const createMessage = (conversationId, data) => api
  .post(`/messages/${conversationId}`, data, {
    headers: { "Content-type": "multipart/form-data" }
  })
  .then(response => camelCaseObject(response));

const fetchStatusMessages = (id) => api
  .get(`/messages/status/${id}`)
  .then(response => camelCaseObject(response));

export default {
  fetchMessages,
  createMessage,
  fetchStatusMessages,
};
