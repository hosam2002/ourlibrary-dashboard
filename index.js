const express = require(`express`)
const mongoose = require(`mongoose`)

/* server */
const app = express()
const port = 5500 || process.env.PORT
const admin = `hosam2002` || `adminOurLibraryUmbaddi@2002`

/* connect to mongodb */
const dburi = `mongodb+srv://hosamumbaddi:hosamdb6070@ourlibrary-db.pfpoxbn.mongodb.net/ourlibrary-site?retryWrites=true&w=majority`
mongoose.connect(dburi).then(success => app.listen(port)).catch(failure => console.log(failure))

/* register a view engine */
app.set(`view engine`, `ejs`)

/* public files */
app.use(express.static('public'))

/* accessing request body property */
app.use(express.urlencoded({ extended: false }))

/* imports */
const Update = require(`./models/blog`)

/* home router */
app.get('/', (req, res) => {

    res.status(200)
    .render(`index`, { title: `ourLibrary Dashboard` })
})

/* blog routers */
app.get('/blog', (req, res) => {

    const getBlogs = async () => {

        try {

            const blogs = await Update.find()

            res.status(200)
            .render(`blogs`, { 
                
                title: `All Blogs`,  
                blog: blogs          
            })
            
        } catch (error) {

            console.log(error)
            
            res.status(200)
            .render(`error`, { title: `Connection Error` })
        }    
    }

    getBlogs()
})

app.delete('/blog/:id', (req, res) => {

    const id = req.params.id

    const deleteBlog = async () => {

        try {

            await Update.findByIdAndDelete(id)
            res.json({ redirect: '/delete-blog' })
            
        } catch (error) {

            console.log(error)

            res.status(200)
            .render(`error`, { title: `Connection Error` })            
        }
    }

    deleteBlog()
})

app.get('/delete-blog', (req, res) => {

    res.status(200)
    .render(`delete`, { title: `Success` })
})

app.post('/add-blog', (req, res) => {

    const { key, title, body } = req.body

    const getDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`

    if (key == admin) {

        const addBlog = async () => {
                
            try {
                
                const blog = await new Update({ title: title, body: body})
                const blogCount = await Update.countDocuments()
                const blogGet = await Update.find()

                res.status(200)
                .render(`success`, {
                    
                    title: `Success`
                })

                blog.save()
                
            } catch (error) {
                
                console.log(error)

                res.status(200)
                .render(`error`, { title: `Connection Error` })
            }
        }

        addBlog()

    } else {

        res.status(200).render(`invalid`, { title: `Invalid Key` })
    }
})