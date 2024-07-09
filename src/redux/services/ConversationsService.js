import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";
import qs from "qs";

const fetchConversations = ({ params }) => api
  .get(`/conversations?${qs.stringify(params)}`)
  .then(response => camelCaseObject(response));

export default {
  fetchConversations,
};
