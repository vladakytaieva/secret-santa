const express = require('express')
const sequelize = require('./database')
const User = require('./models/User')
const Wish = require('./models/Wish')
const Pair = require('./models/Pair')

sequelize.sync({ force: true }).then(res => console.log).catch(err => console.log)

const app = express()

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index.hbs')
})

app.post('/', (req, res) => {
    console.log(req.body)
    const userId = req.body.santaId
    res.redirect(`/santa/${userId}`)
})


app.get('/register', (req, res) => {
    res.render('register.hbs')
})

app.post('/register', (req, res) => {
    console.log(req.body)
    const { name, surname, wishes } = req.body
    const filteredWishes = wishes.filter(el => !!el)
    User.create({
        name,
        surname
    }).then(result => {
        const userId = result.dataValues.id
        filteredWishes.forEach(wish => {
            Wish.create({
                content: wish,
                userId
            })
            .catch(err => console.log)   
        })
        res.redirect(`/${userId}`)
    })
    .catch(err => console.log)
    
})

app.get('/santa/:id', async (req, res) => {
    const { id } = req.params
    const { wisherId } = await Pair.findOne({
        attributes: ['wisherId'],
        where: {
            santaId: id
        },
        raw: true
    })
    const wisherInfo = await User.findOne({
        attributes: ['name', 'surname'],
        where: {
            id: wisherId
        },
        raw: true
    })
    const wishlist = await Wish.findAll({
        attributes: ['content'],
        where: {
            userId: wisherId
        },
        raw: true
    })
    res.render('wisherInfo.hbs', {
        name: wisherInfo.name,
        surname: wisherInfo.surname,
        wishes: wishlist
    }).json({...wisherInfo, ...wishlist})
})

app.post('/shuffle', async (req, res) => {
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }
    const users = await User.findAll({
        attributes: ['id'],
        raw: true
    })
    shuffle(users)
    const medianIdx = Math.floor(users.length / 2)
    const wishers = [...users.slice(medianIdx), ...users.slice(0, medianIdx)]
    for (let i = 0; i < users.length; i++) {
        Pair.create({
            santaId: users[i].id,
            wisherId: wishers[i].id
        })
        .catch(err => console.log)
    }
})

app.get('/:id', async (req, res) => {
    const users = await User.findAll({raw:true})
    res.render('info.hbs', {
        id: req.params.id,
        numOfUsers: users.length
    })
})

app.listen(3000)