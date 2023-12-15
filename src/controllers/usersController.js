import {Router} from 'express'
import express from 'express'
import {createHash} from '../util.js';
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {isValidPassword} from '../util.js';
import {config} from '../config/config.js'
import { usersServices } from '../services/usersServices.js';
import crypto from 'crypto';
export const router = Router ()

const transport = nodemailer.createTransport({
  service:'gmail',
  port:config.PORT,
  auth:{
    user:config.GMAIL_USER,
    pass:config.GMAIL_PASS
  }
})

router.use(express.urlencoded({ extended: true }));

// Login con email con error

async function errorLogin (req,res)  {
    res.redirect('/login?error=Login con error')    
    };

// Login de Git Hub con error

async function errorLoginGitHub (req,res) {
    res.redirect('/loginGitHub?error=**Login con error**')    
    };

// registro con error

async function errorRegistro (req,res) {
    res.redirect('/registro?error=Error de registro')    
    };

// Login de un usuario o del administrador
async function Login (req, res, next) {
    
    req.session.usuario = req.user;
    
    req.session.admin = false;

    if (req.user && req.user.email === config.EMAIL_ADMINISTRADOR) {
      // Establece una propiedad 'admin' en la sesión para identificar al administrador
      req.session.admin = true;
    }
  
    if (req.session.admin) {
      return res.redirect('/admin'); // Redirige al administrador
    } else {
      return res.redirect('/products'); // Redirige al usuario
    }
  };


// logOut

async function logout(req,res) {

   
    await req.session.destroy(e=> console.error(e)),
  
    res.redirect('/login?mensaje=logout correcto... !')

}

// mostrar los datos del usuario que esta registrado

async function current (req,res) {
  const usuario= req.dto.usuario 
  return res.status(200).json({usuario})

}

// mostrar los datos del usuario que esta registrado con handlebars

async function current1 (req,res) {
  
  return res.redirect('./current')
}

// actualizar el tipo de usuario (premium o user)
 async function premium (req,res) {
try {
  const email = req.params.email
  const direccionDeCorreo={username:email}
  const usuario = await usersServices.obtenerUsuarioPorEmail(direccionDeCorreo)
  if (usuario) { 
      if (usuario.typeofuser==='user') {
        usuario.typeofuser="premium"
      }else {
        usuario.typeofuser="user"
      }
      req.session.usuario.typeofuser=usuario.typeofuser
      await usersServices.actualizarUsuario(email,usuario)
      return res.status(201).send('usuario actualizado')
  }
  else {
    return res.status(404).send(`el email informado ${email} no esta registrado`)
  }
}
catch (error){
  return res.status(500).send(`error inesperado al cambiar el tipo de usuario`)
}
 }

// solicitar recuperar la contraseña 

 async function forgot(req, res, next) {
  
  try {
    let email = req.body.email;
    if (!validarCorreoElectronico(email)) {
      return res.status(404).send('el mail informado no tiene un formato válido')
    }
    const direccionDeMail = {}
    direccionDeMail.username = email
    const usuario = await usersServices.obtenerUsuarioPorEmail(direccionDeMail);
    if (!usuario) {
      return res.status(404).send(`El email informado ${email} no está registrado`);
    }
    
    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });  // 1 hora de caducidad
    const useremail = email;
    const sendermail = config.GMAIL_USER;
    const subject = 'Restablecimiento de Contraseña';
    const text = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${config.URLRecuperacionPassword}?token=${token}`;
    await transport.sendMail({
      from: sendermail,
      to: useremail,
      subject: subject,
      text: text
    });
    return res.status(200).send('te fue enviado un mail a tu casilla con un link para reestablecer la contraseñá, expirará en 60 minutos')

  } catch (error) {
    return res.status(500).send(`Error inesperado al tratar de restablecer la contraseña`);
  }
}

// efectuar la recuperación de la contraseña

async function recuperacion (req,res,next) {
  let { email, newPassword } = req.body;
   let usuario
  try {
    if (!validarCorreoElectronico(email)) {
      return res.status(404).send('el mail informado no tiene un formato válido')
    }
    const direccionDeMail = {}
    direccionDeMail.username = email
    usuario = await usersServices.obtenerUsuarioPorEmail(direccionDeMail);
    if (!usuario) {
      return res.status(404).send(`El email informado ${email} no está registrado`);
    }
  } catch (error) {
      return res.status(500),send('error inesperado al tratar de reestablecer la contraseña')
  }

  newPassword=crypto.createHmac('sha256','palabraSecreta').update(newPassword).digest('base64')

  if (isValidPassword(newPassword,usuario.password)) {
    return res.status(403).send('la contraseña no puede ser igual a la anteriormente registrada')
  }
  newPassword=createHash(newPassword);
  usuario.password=newPassword
 

  try {
    await usersServices.actualizarUsuario(email,usuario)
    return res.render('../views/login',{mostrarMensaje:true,error:false, mensaje:'contraseña actualizada, debes hacer login'});
    // return res.status(201).send('contraseña actualizada')
  } catch (error) {
    return res.status(500),send('error inesperado al tratar de actualizar la contraseña')
  }
}

function validarCorreoElectronico(correo) {
  const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return expresionRegular.test(correo);
}

// fin de la funcion para validar el formato del correo electronico

  
  export default {errorLogin, errorLoginGitHub, premium, errorRegistro, Login ,logout, current, current1, forgot, recuperacion}