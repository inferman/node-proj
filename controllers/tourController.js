const fs = require('fs');

const FILE_PATH = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(FILE_PATH));

exports.checkID = (req, res, next, val) => {
  const isIndex = !!(~tours.findIndex(item => item.id === +val));
  if(!isIndex) return res.status(404).json({status:'fail', message: 'wrong id'});
  next();
}

exports.checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price) return res.status(400).json({status:'fail', message: 'Missing name or price!'});
  next();
};

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours: tours
      }
    })
};
exports.getTourById = (req, res) => {
  const tour = tours.find(item => item.id === +req.params.id);
  res
    .status(200)
    .json({
      status: 'success',
      data: {
        tour
      }
    })
};
exports.createTour = (req, res) => {
  const data = req.body;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {...data, id: newId};
  tours.push(newTour);
  fs.writeFile(FILE_PATH, JSON.stringify(tours), (err) => {
    if(err) throw Error('something went wrong')
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};
exports.updateTour = (req, res) => {
  const id = +req.params.id;

  let upd;
  const updatedTours = tours.map(tour => tour.id === id ? (upd = {...tour, ...req.body},upd) : tour);
  fs.writeFile(FILE_PATH, JSON.stringify(updatedTours), (err) => {
    if(err) throw Error('something went wrong')
    res.status(200).json({
      status: 'success',
      data: {
        tour: upd
      }
    });
  })
};
exports.deleteTour = (req, res) => {  
  const updatedTours = tours.filter(tour => tour.id !== +req.params.id);
  fs.writeFile(FILE_PATH, JSON.stringify(updatedTours), (err) => {
    res.status(204).json({status: 'success', data: null});
  });
};

