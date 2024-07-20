import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

export const fetchAIMessageRequest = (conversationId) => api
  .get(`/conversations/ai/${conversationId}`)
  .then(response => camelCaseObject(response));

export const fetchAIMessageRespone = (conversationId, input) => {
    const encodedInput = encodeURIComponent(input);
    return api.get(`/conversations/ai/${conversationId}?input=${encodedInput}`)
      .then(response => camelCaseObject(response));
    };