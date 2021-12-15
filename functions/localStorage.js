var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const getHasUpdate = () => {
    return localStorage.getItem('hasUpdate')
}

const setHasUpdate = (currUpdate) => {
    localStorage['hasUpdate'] = currUpdate
}

const getState = async (sensorName, sensorState) => {
    //Grabs local state from serverside storage using sensorState as a key for it's respective value
    const currState = localStorage.getItem(sensorName)
    
    //If sensorState is undefined, return currState
    if(sensorState === undefined || sensorState === null){
        return currState
    }
    //If passed in object (sensorState) is not equal to currState, return currState
    if(sensorState != currState){
        return currState
    }
    //Regrab currState once every 1 second
    else{
        //Function that regrabs/updates currState and returns currState if currState changes
        function regrabState(){
            currState = localStorage.getItem(sensorName)
            if(sensorState != currState){
                return currState
            }
        }
        //10 iterations with each iteration occuring approximatley every second
        for(let i = 0; i < 10; i++){
            setTimeout(regrabState, 1000)
        }
    }
    return sensorState
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