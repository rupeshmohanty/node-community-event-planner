const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const { restart } = require('nodemon');
const { eventNames } = require('./models/events');
const Event = require('./models/events');

const app = express();

//Mongoose Connection
mongoose.connect('mongodb://localhost:27017/events',{ useNewUrlParser : true , useUnifiedTopology : true },() => {
    console.log('Connected to the database!');
});

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

//Port no
const PORT = 5000;

//Index page
app.get('/', async(req,res) => {
    const events = await Event.find().sort({ createdAt: 'desc' });
    res.render('index',{ events: events });
});

//add event page
app.get('/add-event', (req,res) => {
    res.render('add-event',{ event: new Event() });
});

//showing details about the event
app.get('/:id', async(req,res) => {
    const event = await Event.findById(req.params.id);
    if(event == null) restart.redirect('/');
    res.render('event-details', { event: event });
});

app.post('/add-event', async(req,res) => {
    let event = new Event();
    event.title = req.body.title;
    event.description = req.body.description;
    event.event_date = req.body.event_date;

    try{
        event = await event.save();
        res.redirect(`/${event.id}`);
    } catch(err) {
        res.render('add-event', { event: event });
    }

});



//Listening at Port 5000
app.listen(PORT,console.log(`Listening at ${PORT}`));