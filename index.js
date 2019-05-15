const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var User = require('./user');
const dbURL = 'mongodb://SimonLyu:lxm574976955@cluster0-shard-00-00-kg7uf.mongodb.net:27017,cluster0-shard-00-01-kg7uf.mongodb.net:27017,cluster0-shard-00-02-kg7uf.mongodb.net:27017/UserList?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => { console.log("database connected"); })
    .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

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
                res.json(err);
            }
            //console.log("find done.");
            res.json(users);
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
                res.json(err);
            }
            res.json({ message: `User ${result._id} created!` });
        });
    });

router.route('/users/:uid')
    .get((req, res) => {
        User.findById(req.params.uid, (err, user) => {
            if (err) {
                console.log(err);
                res.json(err);
            }
            res.json(user);
        });
    })
    .put((req, res) => {
        User.findById(req.params.uid, (err, user) => {
            if (err) {
                console.log(err);
                res.json(err);
            }
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.password = req.body.password;
            user.save((err, result) => {
                if (err) {
                    console.log(err);
                    res.json(err);
                }
                res.json({ message: `User ${result._id} update!` });
            });
        });
    })
    .delete((req, res) => {
        User.remove({ _id: req.params.uid }, (err, result) => {
            if (err) {
                console.log(err);
                res.json(err);
            }
            res.json({ message: `User ${result._id} deleted!` })
        });
    });

app.use('/api', router);

app.listen(port, () => console.log("listening port " + port));
