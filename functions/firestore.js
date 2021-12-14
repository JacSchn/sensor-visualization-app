const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../creds/creds.firestore.json');

initializeApp({
    credential: cert(serviceAccount)
});

const SaveStatus = async (sensorName, sensorStatus, misc) => {
    if (sensorName === undefined || sensorName === null || sensorStatus === undefined || sensorStatus === null) {
        throw "Name and Status are mandetory";
    }
    if (misc !== undefined || misc !== null) {
        if (!(misc instanceof Array)) {
            throw "Misc must be an array if populated";
        }
    }
    try {
        const db = await getFirestore();
        const docRef = await db.collection('SensorStatus').doc(sensorName);
        await docRef.set({
            sensorStatus: sensorStatus,
            misc: misc
        });
        return true
    } catch (err) {
        throw err
    }
}

const SaveHistorical = async (sensorName, keyData, valueData, timestamp) => {
    if (sensorName === undefined || sensorName === null || timestamp === undefined || timestamp === null) {
        throw "Name and Timestamp are mandetory";
    }
    sensorName = String(sensorName)
    timestamp = String(timestamp)
    if (keyData !== undefined || keyData !== null || valueData !== undefined || valueData !== null) {
        if (!(valueData instanceof Array) || !(keyData instanceof Array)) {
            throw "keyData and valueData must be an array if populated";
        }
    }
    if (keyData.length !== valueData.length) {
        if (keyData.length !== 0) {
            throw "keyData array and valueData array must be equal length or keyData must be empty array."
        }
    }
    try {
        const db = await getFirestore();
        const docRef = await db.collection(sensorName).doc(timestamp);
        await docRef.set({
            keyData: keyData,
            valueData: valueData
        });
        return true
    } catch (err) {
        throw err
    }
}

const GetHistorical = async (sensorName) => {
    const db = await getFirestore();
    let returnData = []
    const snapshot = await db.collection(sensorName).get();
    snapshot.forEach((doc) => {
        returnData.push(doc.data());
    })
    console.log(returnData)
    return returnData
}

const GetStatus = async (sensorName) => {
    const db = await getFirestore();
    let returnData = []
    const snapshot = await db.collection('SensorStatus').get(sensorName);
    snapshot.forEach((doc) => {
        returnData.push(doc.data());
    })
    console.log(returnData)
    return returnData
}

const getMicroData = async (sensorName, timespan) => {
    const db = await getFirestore();
    let returnData = []
    const dateRef = await db.collection(sensorName).get()
    const snapshot = await dateRef.where('timestamp', '>=', timespan)
    snapshot.forEach((doc) => {
        returnData.push(doc.data())
    })
    console.log(JSON.stringify(returnData))
    return JSON.stringify(returnData)
}

module.exports = {
    SaveHistorical: SaveHistorical,
    SaveStatus: SaveStatus,
    GetHistorical: GetHistorical,
    GetStatus: GetStatus,
    getMircroData: getMicroData
    //DeleteHistorical: DeleteHistorical,
    //DeleteStatus: DeleteStatus
}