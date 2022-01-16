import { COUNTER_CHANGE } from '../constants';
import { PROFILE_SET } from '../constants';
export function changeCount(count) {
    return {
    type: COUNTER_CHANGE,
    payload: count
    }
}
export function setProfile(profile) {
    console.log("Settingggggggggggggggggggggggggggggggggggg",profile);
    return {
    type: PROFILE_SET,
    payload: profile
    }
}