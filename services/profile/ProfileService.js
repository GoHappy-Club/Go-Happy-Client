import axios from 'axios';
import { setProfile } from '../../redux/actions/counts.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';

export const refreshProfile = (phone) => {
  // function getProfile() {
  // const post = useSelector((state) => state.profile);
  // return post;
  // }
  // var url = SERVER_URL + "/user/getUserByPhone";
  // axios
  //   .post(url, { phoneNumber: phone })
  //   .then((response) => {
  //     let { profile, actions } = this.props;
  //     actions.setProfile(response.data);
  //   })
  //   .catch((error) => {
  //     crashlytics().log(error);
  //   });
  // const getProfile = () => {
  //   return state.profile;
  // };
};

// const mapStateToProps = (state) => ({
//   profile: state.profile.profile,
// });

// const ActionCreators = Object.assign({}, { setProfile });
// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });
// export default connect(mapStateToProps, mapDispatchToProps)(RefreshProfile);
