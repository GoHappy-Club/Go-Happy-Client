import { ZOOM_TOKEN_SET } from '../constants';
const initialState = {
  ZOOM_JWT_TOKEN: '',
};
const zoomTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ZOOM_TOKEN_SET:
      return {
        ...state,
        ZOOM_JWT_TOKEN: action.payload,
      };
    default:
      return state;
  }
};
export default zoomTokenReducer;
