import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

const fetchMessages = (conversationId) => api
  .get(`/messages/${conversationId}`)
  .then(response => camelCaseObject(response));

const createMessage = (conversationId, data) => api
  .post(`/messages/${conversationId}`, data)
  .then(response => camelCaseObject(response));

export default {
  fetchMessages,
  createMessage,
};
