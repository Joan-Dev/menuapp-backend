import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email

  const { email, username, token } = data;

  const info = await transport.sendMail({
    from: "MenuApp -  Gestión para restaurantes",
    to: email,
    subject: 'Verifica tu cuenta en MenuApp',
    text:'Verifica tu cuenta en MenuApp',
    html: `<p>Hola: ${username}, comprueba tu cuenta en MenuApp.</p>
        <p>Tu cuenta está lista, solo debes verificarla en el siguiente enlace: <a class="p-4 bg-indigo-700 text-zinc-100" href="${process.env.FRONTEND_URL}/verify/${token}">Verificar Cuenta</a></p>

        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
    `
  });
  console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegister;
