var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const getHasUpdate = () => {
    return localStorage.getItem('hasUpdate')
}

const setHasUpdate = (currUpdate) => {
    localStorage['hasUpdate'] = currUpdate
}

const getState = async (sensorName) => {
    //Grabs local state from serverside storage using sensorState as a key for it's respective value
    const currState = localStorage.getItem(sensorName)
    
    if(currState == undefined || currState == null){
        return error
    }
    
    return currState
}

const setState = (sensorName, passedState) => {
    function checkState(passedState){
        if(passedState == true || passedState == false){
            localStorage.setItem(sensorName, passedState)
        }
        else{
            throw console.error();
        }
    }
    checkState(passedState)
}

module.exports = {
    getHasUpdate: getHasUpdate,
    setHasUpdate: setHasUpdate,
    getMicroState: getMicroState,
    getState: getState,
    setState: setState
}