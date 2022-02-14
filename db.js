const Sequelize = require('sequelize');
const database = new Sequelize('postgres://localhost/dealers_choice_seq',{logging:false})

const Planet = database.define('planet',{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
        validator:{
            notEmpty: true
        }
    },
    diameter: Sequelize.INTEGER,
    sizeRank: Sequelize.INTEGER,
    planetType: Sequelize.STRING
})

const Moon = database.define('moon',{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
        validator:{
            notEmpty: true
        }
    },
    diameter: Sequelize.INTEGER
})
Planet.hasMany(Moon)
Moon.belongsTo(Planet)

const syncAndSeed = async() =>{
    try{
        await database.sync({force:true});
        console.log('CONNECTED TO DB');
        const earth = await Planet.create({name:'Earth', diameter:7917, sizeRank: 5, planetType: 'Rocky'});
        const jupiter = await Planet.create({name:'Jupiter', diameter:86881, sizeRank: 1, planetType: 'Gas Giant'});
        const saturn = await Planet.create({name:'Saturn', diameter:72367, sizeRank: 2, planetType: 'Gas Giant'});
        const mercury = await Planet.create({name:'Mercury', diameter:3032, sizeRank: 8, planetType: 'Rocky'});
        await Moon.create({name:'The Moon', diameter:2159, planetId: earth.id});
        await Moon.create({name:'Europa', diameter:1939, planetId: jupiter.id});
        await Moon.create({name:'Io', diameter:3273, planetId: jupiter.id});
        await Moon.create({name:'Ganymede', diameter:2264, planetId: jupiter.id});
        await Moon.create({name:'Callisto', diameter:2995, planetId: jupiter.id});
        await Moon.create({name:'Titan', diameter:3200, planetId: saturn.id});
        await Moon.create({name:'Enceladus', diameter:313, planetId: saturn.id});
        await Moon.create({name:'Mimas', diameter:246, planetId: saturn.id});
        await Moon.create({name:'Tethys', diameter:660, planetId: saturn.id});
    }
    catch (e){
        console.log(e);
    }
}

module.exports ={
    models:{
        Planet,
        Moon
    },
    syncAndSeed,
    Sequelize,
    database
}