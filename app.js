

const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://shaun:ares2008@cluster0.dsyjzb7.mongodb.net/blog-app-db?appName=Cluster0")

app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    userModel.find({ email: req.body.email }).then(

        (items) => {

            if (items.length > 0) {

                res.json({ "status": "email Id already exist " })
            }

            else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })

            }
        }
    ).catch()


})




app.listen(3030, () => {

    console.log("Server started")
})

