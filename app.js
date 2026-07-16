

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

// Sign In

app.post("/signIn", async (req, res) => {

    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(

        (items) => {

            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {

                    jwt.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" },
                        (error, token) => {

                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            }
                            else {
                                res.json({ "status": "success", "token": token, "userId": items[0]._id })
                            }
                        })

                }
                else {
                    res.json({ "status": "Incorrect Password" })

                }

            }
            else {

                res.json({ "status": "Invalid Email Id" })
            }
        }
    ).catch()
})


//Sign Up

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

