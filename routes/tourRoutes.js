const express = require('express');
const fs = require('fs');

const router = express.Router();


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  
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
const getTourById = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(item => item.id === id);
  if(!tour) {return res.status(404).json({status:'fail', message: 'Data wasn\'t found'})}
  res
    .status(200)
    .json({
      status: 'success',
      data: {
        tour
      }
    })
};
const createTour = (req, res) => {
  const data = req.body;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {...data, id: newId};
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    if(err) throw Error('something went wrong')
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};
const updateTour = (req, res) => {
  const id = +req.params.id;
  const isIndex = !!(~tours.findIndex(item => item.id === id));
  if(!isIndex) return res.status(404).json({status:'fail', message: 'wrong id'});

  let upd;
  const updatedTours = tours.map(tour => tour.id === id ? (upd = {...tour, ...req.body},upd) : tour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err) => {
    if(err) throw Error('something went wrong')
    res.status(200).json({
      status: 'success',
      data: {
        tour: upd
      }
    });
  })
};
const deleteTour = (req, res) => {
  const id = +req.params.id;
  const isIndex = !!(~tours.findIndex(item => item.id === id));
  
  if(!isIndex) return res.status(404).json({status:'fail', message: 'wrong id'})
  const updatedTours = tours.filter(tour => tour.id !== id);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err) => {
    res.status(204).json({status: 'success', data: null});
  });
};






router.route('/')
  .get(getAllTours)
  .post(createTour);

router.route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);


module.exports = router;