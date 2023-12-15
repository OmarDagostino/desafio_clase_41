import productsController from '../controllers/productsController.js'
import {config} from '../config/config.js'
import mongoose from 'mongoose';
import supertest from 'supertest'
import chai from 'chai'
import {describe, it} from 'mocha'
const expect=chai.expect
const should=chai.should
const requester=supertest("http://localhost:8080")


// Conectar a la base de datos MongoDB Atlas
mongoose.connect(config.MONGO_URL);

describe ("Probando el proyecto de comercio electrónico", function () {
    this.timeout(8000)

    describe ("Pruebas del modulo de productos", function () {
        describe ("Prueba del endpoint GET para todos o varios productos", function () {
            before(async function(){
                this.ProductsController=new productsController()
            })

            it("El router debe devolver un array con los productos", async function(){

                let resultado=await this.ProductsController.getProducts()
        
                assert.strictEqual(Array.isArray(resultado), true)
        
            })
        
        
        })
    })
})


