import mongoose from 'mongoose';
import {productModel} from '../models/product.model.js';
import {Router} from 'express';
import { ObjectId } from 'mongodb';
import {config} from '../config/config.js'

const router = Router ()

// Conectar a la base de datos MongoDB Atlas
mongoose.connect(config.MONGO_URL);


// clases para el manejo de productos

export class productsDataManager { 
 


// obtener una lista de productos con filtros y paginaciones

async obtenerProductos (combinedFilter, options)
{
  try {
    const products = await productModel.paginate(combinedFilter, options);

    return (products);
  } catch (error) {
    console.error({ status: 'error', message: 'Error en el servidor',error });
  }
};

// obtener un producto por su ID
async obtenerProducto (pid) 
{
  try {
    const productId = pid ;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      console.error("* Identificador de Producto invalido *");
      } else {
        const product = await productModel.findOne({ _id: productId}).exec();
        if (product) {
          return (product);
        } else {
          console.error('Producto no encontrado');
        }
      }
  } catch (error) {
    console.error(`Error en el servidor ${error}`);
  }
};

// obtener un producto por su codigo

async obtenerProductoPorCodigo (codigo) 
{
  try {
  const existingProduct = await productModel.findOne({ code: codigo }).exec();
  return existingProduct
 }
 catch (error) {
  console.error(`Error en el servidor ${error}`);
  }
};

// Crear un nuevo producto
async crearProducto (newProduct) 
{
    try {
      
      const product = new productModel({ ...newProduct});
      if (product.status===undefined || product.status !== true && product.status !== false ) {
        product.status = true
      }
      await product.save();
  
      
    } catch (error) {
      console.error('Error en el servidor',error);
    }
  };
  

// actualizar un productos
async actualizarProducto (producto,pid) 
{
  try {
    const productId = pid;
    const updatedProduct = producto;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      console.error("** Identificador de Producto invalido **");
      } else {


    let product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      console.error('Producto no encontrado');
      return;
    }


    product = updatedProduct
    await product.save();
    
  }
  } catch (error) {
    console.error('******Error en el servidor*******');
  }
};

// Eliminar un producto por su ID
async eliminarProducto (pid) 
{
  try {
    const productId = pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      console.error("Identificador de Producto invalido");
      } else {

    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      console.error('Producto no encontrado');
      return;
    }

    await product.deleteOne({ _id : productId })
    console.error(`Producto con ID ${productId} eliminado`)
  }
  } catch (error) {
    console.error(error)
    console.error('Error en el servidor')
  }
}
}

export default productsDataManager
