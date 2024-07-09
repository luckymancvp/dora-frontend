import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

const fetchMessages = (conversationId) => api
  .get(`/messages/${conversationId}`)
  .then(response => camelCaseObject(response));

export default {
  fetchMessages,
};
