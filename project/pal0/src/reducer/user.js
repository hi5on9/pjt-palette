
const types = {
    CHECKED_JOIN : 'CHECKED_JOIN',
    CHECKED_LOGIN : 'CHECKED_LOGIN',
    CHECKED_RESULT : 'CHECKED_RESULT',
};


const init = {
    loginState : false,
    JoinState : false,
    ResultState : false
}

const prev = false

export default user = (state = init, action ) =>{
    switch(action.type){
        case types.CHECKED_JOIN:
            const join = action.types.CHECKED_JOIN
            const joinpage = join.pageState
            return joinpage
        case types.CHECKED_LOGIN :
            const login = action.pageState;
            const loginpage = login.pageState
            console.log('reducer:'+login)
            return login;
        case types.CHECKED_RESULT:
            return action.pageState;
        default:
            return state;    
    }
}
