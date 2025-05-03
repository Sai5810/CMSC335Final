class MainController {
    getIndex(req, res) {
        res.render('index');
    }

    handleError(req, res) {
        res.render('error');
    }
}

module.exports = MainController;