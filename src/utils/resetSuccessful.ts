const resetSuccessfulHTML = (firstName: string) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
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
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-header img {
            width: 150px;
            height: auto;
        }

        .email-content {
            padding: 20px;
            text-align: left;
            color: #333;
        }

        .email-content h1 {
            color: #1a3783;
            font-size: 24px;
        }

        .email-content p {
            font-size: 16px;
            margin: 20px 0;
        }

        .success-icon {
            text-align: center;
            margin: 20px 0;
        }

        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #888;
            background-color: #f0efef;
        }

        .email-footer a {
            color: #500050;
            text-decoration: none;
        }

        .social-icons img {
            width: 18px;
            height: 18px;
            margin: 0 5px;
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
            <h1>Password Reset Successful!</h1>
            <div class="success-icon">
                <img src="https://res.cloudinary.com/dx6qmw7w9/image/upload/v1726437304/ezgif.com-video-to-gif-converter_5_ul1grn.gif" alt="Success Icon" style="width: 90%;">
            </div>
            <p>Hi ${firstName},</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <p>If you did not initiate this action, please contact support immediately.</p>
        </div>
        <div class="email-footer">
            <div class="social-icons">
                <a href="#"><img src="https://res.cloudinary.com/dx6qmw7w9/image/upload/v1705725721/350974_facebook_logo_icon_zoxrpw.png" alt="Facebook"></a>
                <a href="#"><img src="https://res.cloudinary.com/dx6qmw7w9/image/upload/v1705725720/twitter-icon_fdawvi.png" alt="Twitter"></a>
                <a href="#"><img src="https://res.cloudinary.com/dx6qmw7w9/image/upload/v1705725721/Instagram-PNGinstagram-icon-png_yf4g2j.png" alt="Instagram"></a>
            </div>
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

export {resetSuccessfulHTML};