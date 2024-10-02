import { COUNTER_CHANGE } from '../constants';
import { PROFILE_SET } from '../constants';
import { ZOOM_TOKEN_SET } from '../constants';
export function changeCount(count) {
  return {
    type: COUNTER_CHANGE,
    payload: count,
  };
}
export function setProfile(profile) {
  return {
    type: PROFILE_SET,
    payload: profile,
  };
}
export function setZoomToken(token) {
  return {
    type: ZOOM_TOKEN_SET,
    payload: token,
  };
}