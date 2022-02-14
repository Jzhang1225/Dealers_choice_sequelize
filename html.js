const {syncAndSeed, Sequelize, database, models:{Planet, Moon}} = require('./db');
const methodOveride = require('method-override');
const res = require('express/lib/response');
const listOfPlanets = async () => {
    const planets = await Planet.findAll()
    return `
    <html>
        <head><title>List of Planets</title></head>
        <body>
            <h1> List of Planets </h1>
            <div>Add a Moon <a href='/planets/add'>here</a></div>
            <br>
            ${planets.map(planet =>{
               return `<div> <a href ='/planets/${planet.id}'>
                ${planet.name}</a> is a ${planet.planetType} planet and 
                has a diameter of ${planet.diameter} miles. <br>
                It is Rank ${planet.sizeRank} in planet size in our Solar System.
                </div>`
            }).join('')
            }
        </body>
    </html>
    `
}

const planetAndMoon = async(request)=>{
    const planet = await Planet.findByPk(request, {
        include: [Moon]
    })
    return `
    <html>
        <head><title>List of Planets</title></head>
        <body>
            <h1> ${planet.name}'s Moons </h1>
            <div><a href ='/'>Go Back to Planets</a> </div>
            <br>
            <div>Add a Moon <a href='/planets/add'>here</a></div>
            <br>
            ${planet.moons.map(moon =>{
                return `<div>
                ${moon.name} has a diameter of ${moon.diameter} miles.
                <form method = 'POST' action ='/moons/${moon.id}?_method=delete'>
                <button> Delete ${moon.name} </button>
                </form>
                </div>`
            }).join('')}
        </body>
    </html>
    `
}
const addMoon = async()=>{
    const planets = await Planet.findAll()
    return `
    <html>
        <head><title>Add Moon</title></head>
        <body>
            <h1> Add a Moon </h1>
            <div><a href ='/'>Go Back to Planets</a></div>
            <form method ='post' action='/moons'>
            <select name = 'id'>
            ${planets.map(planet =>{
                return `
                <option value='${planet.id}'>${planet.name}</option>
                `
            }).join('')}    
            </select>
            <input type="text" name="name" placeholder='Moon Name'/>
            <input type="number" name="diameter" placeholder='Moon Diameter'/>
            <button type="submit">Add Moon</button>
        </body>
    </html>
    `
}

module.exports = {listOfPlanets, planetAndMoon, addMoon}