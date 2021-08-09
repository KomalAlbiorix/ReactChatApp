import axios from 'axios';
import Constants from '../component/constant/Constants';

export default getFriendsList = () => {
    try {
        axios.get(Constants.GET_USER_URL + friendId).then(res => {
            if (res) {
                setUser(res.data)
            }
        })
    }
    catch (err) {
        return err
    }

}