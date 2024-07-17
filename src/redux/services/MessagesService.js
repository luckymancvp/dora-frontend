import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

export const fetchMessagesRequest = (conversationId) => api
  .get(`/messages/${conversationId}`)
  .then(response => camelCaseObject(response));

export const createMessageRequest = (conversationId, data) => api
  .post(`/messages/${conversationId}`, data, {
    headers: { "Content-type": "multipart/form-data" }
  })
  .then(response => camelCaseObject(response));

export const fetchStatusMessagesRequest = (id) => api
  .get(`/messages/status/${id}`)
  .then(response => camelCaseObject(response));
