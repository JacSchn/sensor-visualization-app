var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const getHasUpdate = () => {
    return localStorage.getItem('hasUpdate')
}

const setHasUpdate = (currUpdate) => {
    localStorage['hasUpdate'] = currUpdate
}

const getState = (sensorName) => {
    const currState = localStorage.getItem(sensorName)
    
    if(currState == undefined || currState == null){
        return error
    }
    return currState
}

const setState = (sensorName, passedState) => {
    function checkState(passedState){
        console.log(sensorName)
        console.log(passedState)
        if(passedState == 'true' || passedState == 'false'){
            console.log("If is true")
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
    getState: getState,
    setState: setState
}