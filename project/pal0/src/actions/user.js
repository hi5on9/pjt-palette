
const types = {
    CHECKED_JOIN : 'CHECKED_JOIN',
    CHECKED_LOGIN : 'CHECKED_LOGIN',
    CHECKED_RESULT : 'CHECKED_RESULT',
};


export function joinState(state) {
    console.log('user:'+state.user.init.loginState)
    return {
        type: types.CHECKED_JOIN,
        pageState : state
    };
}

export function loginState(state) {
    return {
        type: types.CHECKED_LOGIN,
        pageState : state
    };
}

export function getresultPage(state){
    return {
        type : types.CHECKED_RESULT,
        pageState : state
    }
}
