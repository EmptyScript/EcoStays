const User = require("../models/user.js")

module.exports.rendersignupForm = async(req,res)=> {
    res.render("users/signup.ejs")
}
module.exports.signupRoute = async(req,res)=> {
    try {
    let {username, email, password} = req.body
    const newUser = new User ({email, username})
    let registeredUser = await User.register(newUser, password)
    
    req.login((registeredUser), (err)=> {
        if(err){
            next(err)
        }
        req.flash("successs", "Welcome to EcoStays")
    res.redirect("/listings")
    })
    }
    catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")

    }
} 

module.exports.renderLoginForm = async(req,res)=> {
    res.render("users/login.ejs")
} 
module.exports.loginRoute = async(req,res)=> {
    req.flash("successs", "Welcome to EcoStays")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logoutRoute = (req,res)=> {
    req.logout((err)=> {
        if(err){
            next(err)
        }
        req.flash("successs", "User logged out")
        res.redirect("/listings")
    })
}