import { describe, it, before } from 'mocha';
import mongoose from 'mongoose'
import chai from 'chai';
import supertest from 'supertest';

await mongoose.connect('mongodb+srv://omardagostino:laly9853@cluster0.x1lr5sc.mongodb.net/ecommerce1')

const expect=chai.expect
const requester=supertest("http://localhost:8080")

describe('Probando el proyecto de comercio electrónico', function () {
  this.timeout(20000);

  describe('Pruebas del modulo de productos', function () {
    describe('Prueba del endpoint GET para todos o varios productos', function () {
  
      it('El router debe devolver un objeto con los productos', async function () {
        console.log ('requester')
        let user=await requester.post("/api/sesions/login?email=juan@camino.com&password=juan")
        console.log('***** user ****', user.body)
        let response = await requester.get("/api/products")
           
        expect(response).to.have.property('payload');
        console.log('** response.status**',response.status)
        console.log('** response.body**',response.body)
        console.log('** response**',response)
      
      });
    });
  });
})


