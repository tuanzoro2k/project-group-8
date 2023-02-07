
class SiteController {
    //[GET] /
    home(req, res) {
        const sess = req.session.userID;
        res.render('home', {sess});
    }

    //[GET] /blog
    blog(req, res) {
        const sess = req.session.userID;
        res.send('blog page', {sess});
    }

    //[GET] /login-page
    login(req, res) {
        const sess = req.session.userID;
        res.render('login', {sess});
    }

    //[GET] /page-info
    pages(req, res) {
        const sess = req.session.userID;
        res.send('page-info', {sess})
    }
}

module.exports = new SiteController;