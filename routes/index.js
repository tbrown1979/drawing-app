exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

module.exports = function(io) {
  var routes = {};
  routes.index = function (req, res) {
    res.render('index', {title: 'Express'});
    }
  return routes;
};