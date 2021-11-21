module.exports.profile = function(req,res){
    res.render('user_profile', {
        title: "profile"
    });
}