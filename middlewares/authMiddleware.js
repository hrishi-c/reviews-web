function ensureAuthenticated(req, res, next) {
    if (req.session.user && (req.session.user.role === 'patient' || req.session.user.role === 'doctor')) {
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = { ensureAuthenticated };