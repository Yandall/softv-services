const nodemailer = require('nodemailer')

const sendNotification = (req, res) => {
    let body = req.body
    if (!body.toEmail){
        res.status(400).send({success: false, message: "Please provide a valid email", error:"Field toEmailsss can't be empty"})
        return
    }
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "devtest.steven1@gmail.com",
            pass: "lolufdtoijufnjhg"
        }
    })

    let message = {
        from: "devtest.steven1@gmail.com",
        to: body.toEmail,
        subject: body.subject || "Without subject",
        text: body.message || "Withouth message"
    }
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error(error)
            res.status(500).send({success: false, message: "There was an error trying to send email", error: error.message})
        } else {
            console.log("Sending email")
            res.status(200).send({success: true, message: `Email sended to ${body.toEmail} succesfully`})
        }
    })
}

module.exports = {sendNotification}