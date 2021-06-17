function errorHandler(err, req, res, next) {
    switch (err.name) {
        case 'UnauthorizedError':
            res.status(401).send({
                message: '此用戶無權限',
                data: err
            })
            break;

        case 'ValidationError':
            res.status(401).send({
                message: '驗證出錯',
                data: err
            })
            break;

        default:
            res.status(500).send({
                message: err
            })
            break;
    }
}

module.exports = errorHandler