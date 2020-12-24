const express = require('express');
const mongoose = require('mongoose');
const path = require('path')

const methodOverride = require('method-override');

const Blog = require('./models/Blog');

const blogRouter = require('./routes/blogs');

const app = express();

//Connect to database
mongoose.connect('mongodb+srv://cuongvo862:123@cluster0.qkni3.mongodb.net/Bearbrick', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(express.static(path.join(__dirname,'public')));

//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//route for the index
app.get('/', async (request, response) => {
    let blogs = await Blog.find().sort({ timeCreated: 'desc' });

    response.render('index', { blogs: blogs });
});

app.use('/blogs', blogRouter);

//listen PORT
app.listen(process.env.PORT || 2);