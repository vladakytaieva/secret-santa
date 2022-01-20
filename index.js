const express = require('express')
const sequelize = require('./database')
const User = require('./models/User')
const Wish = require('./models/Wish')
const Pair = require('./models/Pair')
const async = require('hbs/lib/async')

sequelize.sync({ force: true }).then(res => console.log).catch(err => console.log)

const app = express()

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res) => {
    try {
        const pairs = await Pair.findAll({raw:true})
        res.render('index.hbs', {
            message: pairs.length ? 'none' : 'block',
            disabled: pairs.length ? '' : 'disabled'
        })
    } catch(err) {
        console.log(err)
    }
})

app.post('/', (req, res) => {
    console.log(req.body)
    const userId = req.body.santaId
    res.redirect(`/santa/${userId}`)
})


app.get('/register', async (req, res) => {
    const users = await User.findAll({raw:true})
    res.render('register.hbs', {
        message: users.length === 500 ? 'Reached maximum number of users' : '',
        disabled: users.length === 500 && 'disabled'
    })
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
    try {
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
        })
    } catch(err) {
        res.redirect('/')
    }
})

app.get('/shuffle', async (req, res) => {
    try {
        const users = await User.findAll({raw:true})
        res.render('shuffle.hbs', {
            numOfUsers: users.length,
            message: users.length >= 3 ? 'Shuffle now or wait for more users' : 'Waiting for more players...',
            disabled: users.length >= 3 ? '' : 'disabled'
        })
    } catch(err) {
        res.redirect('/')
    }
})

app.post('/shuffle', async (req, res) => {
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }
    try {
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
        res.redirect('/')
    } catch(err) {
        res.json('failed to shuffle players')
    }
})

app.get('/:id', async (req, res) => {
    try {
        const users = await User.findAll({raw:true})
        res.render('info.hbs', {
            id: req.params.id,
            numOfUsers: users.length
        })
    } catch(err) {
        res.json('failed to get users')
    }
})

app.listen(3000)