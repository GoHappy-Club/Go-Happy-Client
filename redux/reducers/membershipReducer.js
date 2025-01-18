import { MEMBERSHIP_SET } from "../constants";
const initialState = {
  membership: '',
};
const membershipReducer = (state = initialState, action) => {
  switch (action.type) {
    case MEMBERSHIP_SET:
      return {
        ...state,
        membership: action.payload,
      };
    default:
      return state;
  }
};
export default membershipReducer;
