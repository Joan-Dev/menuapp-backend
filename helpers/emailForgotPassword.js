import nodemailer from "nodemailer";

const emailForgotPassword = async (data) => {
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
    subject: 'Reestablece tu contraseña en MenuApp',
    text:'Verifica tu cuenta en MenuApp',
    html: `<p>Hola: ${username}, haz solicitado reestablecer tu contraseña en MenuApp.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: <a class="p-4 bg-indigo-700 text-zinc-100" href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer password</a></p>

        <p>Si tú no solicitaste esta acción, puedes ignorar este mensaje</p>
    `
  });
  console.log('Mensaje enviado: %s', info.messageId);
};

export default emailForgotPassword;
