import { connect } from 'react-redux';

import * as Actions from './ActionTypes';
import HomeDashboard from '../../components/HomeDashboard';

const mapStateToProps = (state) => ({
     count: state.counterReducer.count
});

const mapDispatchToProps = (dispatch) => ({
    getEvents: () => dispatch({type: Actions.UPDATE_EVENTS}),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);