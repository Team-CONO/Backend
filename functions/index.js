const functions = require('firebase-functions');
global.admin = require('firebase-admin');
// Packages
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')({origin: true})

const authManager = require('./Attribute/AuthManager');

const authApi = express();

const serviceAccount = require('./service-account.json')
const projectInfo = {
    databaseURL: functions
        .config()
        .project
        .database,
    storageBucket: functions
        .config()
        .project
        .storage,
    projectId: functions
        .config()
        .project
        .project_id
}
projectInfo['credential'] = global
    .admin
    .credential
    .cert(serviceAccount)
global
    .admin
    .initializeApp(projectInfo)

authApi.use(cors);
authApi.use(authManager.verifyToken)
authApi.post('/token', (req, res) => {
    // res.send("ok");/
    var db = admin.database();
    var ref = db.ref(`accounts/${req.currentUID}/role`);
    ref.once("value", function (snapshot) {
        const role = snapshot.val() || 'Guest';
        global
            .admin
            .auth()
            .createCustomToken(req.currentUID, {role: role})
            .then(function (customToken) {
                // Send token back to client
                res.send({success: true, token: customToken})
                return true;
            })
            .catch(function (error) {
                res.send({success: false, message: error.message})
                return false;
            });
    });
})
authApi.post('/admin', (req, res) => {
    // res.send('check')
    let user_uid = req
        .body
        console
        .log(user_uid);
})

exports.auth = functions
    .region('asia-northeast1')
    .https
    .onRequest(authApi)