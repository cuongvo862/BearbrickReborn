const { request, response } = require('express');
const express = require('express');
const Blog = require('./../models/Blog');
const router = express.Router();
const multer = require('multer');

//define storage for the images
const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public/uploads/images');
    },

    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3,
    },
});


router.get('/news', (request, response) => {
    response.render('new');
});

router.get('/about', (request, response)=>{
    response.render('about');
});


//list item
router.get('/list', async (request, response) => {
    let blogs = await Blog.find().sort({ timeCreated: 'desc' });

    response.render('list', { blogs: blogs });
});


//new post
router.post('/', upload.single('image') ,async (request, response) => {
    console.log(request.file);
    let blog = new Blog({
        title: request.body.title,
        price: request.body.price,
        condition: request.body.condition,
        img:request.file.filename,
    });

    try {
        body = await blog.save();
        response.redirect(`${blog.slug}`);
    } catch (error) {
        console.log(error);
    }
});


//router delete
router.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.redirect('/');
});


router.get('/:slug', async (request, response) => {
    let blog = await Blog.findOne({ slug: request.params.slug });

    if (blog) {
        response.render('show', { blog: blog });
    }
    else {
        response.redirect('/');
    }
});


module.exports = router;