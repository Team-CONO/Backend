const functions = require('firebase-functions');
const admin = require('firebase-admin');
// Packages
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')({ origin: true })

const authApi = express();

const serviceAccount = require('./service-account.json')
const projectInfo = {
    databaseURL: functions.config().project.database,
    storageBucket: functions.config().project.storage,
    projectId: functions.config().project.project_id
}
projectInfo['credential'] = admin.credential.cert(serviceAccount)
admin.initializeApp(projectInfo)

authApi.use(cors);
authApi.post('/token', (req, res) => {
    // res.send("ok");/
    admin.auth().createCustomToken(req.body.uid, {role: 'TEST'})
        .then(function(customToken) {
            // Send token back to client
            res.send({
                success: true,
                token: customToken
            })
            return true;
        })
        .catch(function(error) {
            res.send({
                success: false,
                message: error.message
            })
            return false;
        });
})

exports.auth = functions.region('asia-northeast1').https.onRequest(authApi)