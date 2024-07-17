import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";
import qs from "qs";

const fetchShopsRequest = ({ params }) => api
  .get(`/shops?${qs.stringify(params)}`)
  .then(response => camelCaseObject(response));

export default fetchShopsRequest;
