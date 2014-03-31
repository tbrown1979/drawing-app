exports.index = function (req, res) {
    res.render('index', {title: 'Express'});
}

exports.pictionary = function (req, res) {
  res.render('pictionary', {title: 'Pictionary'})
}