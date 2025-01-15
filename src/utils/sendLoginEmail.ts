const generateLoginNotificationEmail = (firstName: string, loginTime: string, deviceType: string, deviceName: string, deviceBrowser: string) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 500px;
            background-color: #ffffff;
            border: 1px solid #ddd;
        }

        .email-header {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: auto;
            margin-top: 10px;
            object-fit: contain;
        }

        .email-header img {
            width: 150px;
            height: auto;
        }

        .email-content {
            background-color: white;
            text-align: left;
            color: #333;
            padding: 20px;
        }

        .email-content h1 {
            color: #1a3783;
            font-size: 24px;
        }

        .email-content p {
            font-size: 16px;
            margin: 20px 0;
        }

        .line {
            border-bottom: 1.5px solid #ccc;
            width: 100%;
        }

        .email-footer {
            text-align: center;
            padding: 10px 10px;
            font-size: 14px;
            color: #888;
            background-color: #f0efef;
        }

        .email-footer a {
            color: #500050;
            text-decoration: none;
        }
    </style>
</head>

<body>
 <center style="width: 100%;">
    <div class="email-container">
        <div class="email-header">
            <img src="https://res.cloudinary.com/dx6qmw7w9/image/upload/v1736886739/Eben_Logo2_jjmwks.png" alt="Bookie Pal Logo">
        </div>
        <div class="email-content">
            <h1>Login Notification</h1>
            <div class="line"></div>
            <p>Hi ${firstName},</p>
            <p>You have successfully logged in to your Bookie Pal account.</p>
            <p>Login Time: ${loginTime}</p>
            <p>Device: [type: ${deviceType}, name: ${deviceName}, browser: ${deviceBrowser}] </p>
            <p>If this was not you, please contact our support team immediately.</p>
        </div>
        <div class="email-footer">
                    <p style="color: #333;">&#10084; &nbsp; <strong>Bookie Pal By DevEben</strong></p>
                    <p>Empowering minds, one book at a time <br> Your partner in learning, anywhere, anytime.</p>
                    <p style="color: #333;">Lagos, Nigeria</p>
                    <p><a href="mailto:ebenezertope4@gmail.com">support@bookiepalbydeveben.com</a></p>
        </div>
    </div>
    </center>
</body>

</html>
    `;
};

export { generateLoginNotificationEmail };