const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var User = require('./user');
const dbURL = 'mongodb://SimonLyu:lxm574976955@cluster0-shard-00-00-kg7uf.mongodb.net:27017,cluster0-shard-00-01-kg7uf.mongodb.net:27017,cluster0-shard-00-02-kg7uf.mongodb.net:27017/UserList?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => { console.log("database connected"); })
    .catch(err => console.error(err));

//Use middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("A " + req.method + " request received at " + new Date());
    next();
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.get('/', (req, res) => {
    //console.log("hello world!")
    res.json({ message: "hello to user list app." });
});

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.route('/users')
    .get((req, res) => {
        User.find((err, users) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else res.status(200).json(users);
        });
    })
    .post((req, res) => {
        let user = new User();
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.age = req.body.age;
        user.gender = req.body.gender;
        user.password = req.body.password;
        user.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else res.status(200).json({ message: `User ${result._id} created!` });
        });
    });

router.route('/users/:uid')
    .get((req, res) => {
        User.findById(req.params.uid, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else res.status(200).json(user);
        });
    })
    .put((req, res) => {
        //console.log({...req.body});
        User.findById(req.params.uid, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else if (user.password !== req.body.password) {
                res.status(210).json({ message: "Wrong Password!" });
            } else {
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.age = req.body.age;
                user.gender = req.body.gender;
                user.save((err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else res.status(200).json({ message: `User ${result._id} created!` });
                });
            };
        })
    })
    .delete((req, res) => {
        User.findOneAndDelete({ _id: req.params.uid }, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else res.status(200).json({ message: `User ${user._id} deleted!` })
        });
    });

app.use('/api', router);

var port = process.env.PORT || 8080;

app.listen(port, () => console.log("listening port " + port));
