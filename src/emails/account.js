const sgMail = require('@sendgrid/mail')
//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
const sendgridAPIKey = ''

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
sgMail.send({
  to: email,
  from: 'abhinav98kr@gmail.com',
  subject: 'Thanks for joining in!',
  text: 'Welcome to the app, ${name}. Let me know how you gey along with the app.'
})
}

const sendCancelationEmail = (email, name) => {
sgMail.send({
  to: email,
  from: 'abhinav98kr@gmail.com',
  subject: 'Sorry to see you go!',
  text: 'Goodbye, ${name}. I hope to see you back sometime soon'
})
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}
