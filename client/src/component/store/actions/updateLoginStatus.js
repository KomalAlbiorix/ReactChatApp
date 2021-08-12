export const UpdateLoginStatus = (state, payload) => {
    return {
        ...state,
        isLogin:payload
    }
}