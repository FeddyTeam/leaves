const qiniu = require('qiniu')

module.exports = () => {
    const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET } = process.env

    const qiniuMac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
    const putPolicy = new qiniu.rs.PutPolicy({
        scope: QINIU_BUCKET
    })

    return putPolicy.uploadToken(qiniuMac)
}
