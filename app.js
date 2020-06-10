const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

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

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({status: 'error', message: 'This route is not yet defined!'});
}

const createUser = (req, res) => {
  res
    .status(500)
    .json({status: 'error', message: 'This route is not yet defined!'});
}

const getUserById = (req, res) => {
  res
    .status(500)
    .json({status: 'error', message: 'This route is not yet defined!'});
}

const updateUser = (req, res) => {
  res
    .status(500)
    .json({status: 'error', message: 'This route is not yet defined!'});
}

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({status: 'error', message: 'This route is not yet defined!'});
}

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

app.route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);


const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  
});

