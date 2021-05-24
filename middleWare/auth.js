module.exports.requireAuth = function(req, res, next) {
    if(!req.cookies.userId){
        res.redirect('/user/loginAcc')
        return
    }
    next()

}
module.exports.requireAuthStaff = function(req, res, next) {
    console.log(req.cookies,req.signedCookies)
    if(!req.signedCookies.staffId){
        res.redirect('/staff/login')
        return
    }
    next()
  
  }