exports.verifyToken = function (request, response, next) {
    global.admin.auth().verifyIdToken(request.get('Authorization'))
    .then(function(decodedToken) {
        let uid = decodedToken.uid;
        // ...
        request.currentUID = uid;
        next();
        return true;
    }).catch(function(error) {
        // Handle error
        response.send({
            success: false,
            message: error.message
        })
    });
}