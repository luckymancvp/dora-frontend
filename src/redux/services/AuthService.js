import api from "../ApiCommon";
import { camelCaseObject } from "../../utils/Utils";

const getProfile = () => api
  .get('users/profile')
  .then(response => camelCaseObject(response));


export default {
  getProfile,
};
