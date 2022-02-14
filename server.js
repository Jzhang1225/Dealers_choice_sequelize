const express = require('express');
const app = express();
const {syncAndSeed, Sequelize, database, models:{Planet, Moon}} = require('./db');
const {listOfPlanets, planetAndMoon, addMoon} = require ('./html')
const methodOveride = require('method-override')

app.use(methodOveride('_method'))
app.use(express.urlencoded({extended:false}))

app.get('/',(req, res)=> res.redirect('/planets'))
app.get('/planets', async(req, res, next)=>{
    try{
        const response = await listOfPlanets()
        res.send(response)
    }
    catch (e){
        next(e)
    }
})

app.get('/planets/add', async (req,res,next)=>{
    try{
        const response = await addMoon();
        res.send(response)
    }
    catch(e){
        next(e)
    }
})

app.get('/planets/:id', async (req, res, next)=>{
    try{
        const request = req.params.id
        const response = await planetAndMoon(request);
        res.send (response)
    }
    catch(e){
        next(e)
    }
})

app.post('/moons', async(req,res,next)=>{
    try{
        const {id, name, diameter} = req.body
        if(!name || !diameter) {
            res.send(`A name and a diameter is required!
        <a href='/planets/add'>Try again</a>`)
        }
        const moon = await Moon.findAll({where:{name:name}})
        if(moon.length === 0){
            await Moon.create({name:name, diameter:diameter, planetId: id});
            res.redirect(`/planets/${id}`)
        }
        else res.send(`${name} already exists!
        <a href='/planets/add'>Try again</a>`)
    }
    catch(e){
        next(e)
    }
})

app.delete('/moons/:id',async(req, res, next) =>{
    try{
        const moon = await Moon.findByPk(req.params.id);
        await moon.destroy();
        res.redirect(`/planets/${moon.planetId}`)
    }
    catch(e){
        next(e)
    }
})

const setup = async() =>{
    try{
        await syncAndSeed();
        const port = 3000;
        app.listen(port, ()=>{
            console.log(`LISTENING ON PORT ${port}`);
        })
    }
    catch (e){
        console.log(e);
    }
}
setup();