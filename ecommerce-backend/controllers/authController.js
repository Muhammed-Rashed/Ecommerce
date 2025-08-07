const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin', // Add isAdmin based on role
      isVerified: user.isVerified
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({ name, email, password });
  const emailToken = createToken(user);

  const url = `http://localhost:5000/auth/verify/${emailToken}`;
  
  // Enhanced email template
  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .welcome-text {
                font-size: 18px;
                color: #333333;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .verify-btn {
                display: inline-block;
                padding: 15px 35px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            .verify-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer p {
                color: #6c757d;
                font-size: 14px;
                margin: 5px 0;
            }
            .security-note {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #856404;
            }
            .icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">📧</div>
                <h1>Welcome to Our Platform!</h1>
            </div>
            
            <div class="content">
                <p class="welcome-text">
                    Hi <strong>${name}</strong>,<br><br>
                    Thank you for signing up! We're excited to have you on board. 
                    To get started, please verify your email address by clicking the button below.
                </p>
                
                <a href="${url}" class="verify-btn">Verify My Email</a>
                
                <div class="security-note">
                    <strong>Security Note:</strong> This verification link will expire in 7 days for your security. 
                    If you didn't create an account with us, please ignore this email.
                </div>
                
                <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                    If the button doesn't work, you can copy and paste this link into your browser:<br>
                    <span style="color: #667eea; word-break: break-all;">${url}</span>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Need Help?</strong></p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail(email, '✅ Verify Your Email Address', emailHTML);

  res.status(201).json({ message: 'Signup success! Check email to verify.' });
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    await user.save();
    
    // Create a new token for the verified user
    const loginToken = createToken(user);
    
    // Send success page with login confirmation
    const successHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified Successfully</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 500px;
                  background-color: #ffffff;
                  border-radius: 15px;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                  text-align: center;
                  padding: 40px;
                  margin: 20px;
              }
              .success-icon {
                  font-size: 80px;
                  color: #28a745;
                  margin-bottom: 20px;
                  animation: bounce 1s ease-in-out;
              }
              @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-10px); }
                  60% { transform: translateY(-5px); }
              }
              h1 {
                  color: #333;
                  font-size: 28px;
                  margin-bottom: 15px;
                  font-weight: 300;
              }
              .message {
                  color: #666;
                  font-size: 16px;
                  margin-bottom: 15px;
                  line-height: 1.6;
              }
              .logged-in-status {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 15px 20px;
                  border-radius: 10px;
                  margin: 20px 0;
                  font-size: 18px;
                  font-weight: 600;
              }
              .login-btn {
                  display: inline-block;
                  padding: 15px 35px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 50px;
                  font-size: 16px;
                  font-weight: 600;
                  transition: transform 0.2s ease;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                  margin-top: 20px;
              }
              .login-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="success-icon">✅</div>
              <h1>Email Verified Successfully!</h1>
              <p class="message">
                  Great! Your email has been verified successfully.
              </p>
              <div class="logged-in-status">
                  🎉 You are logged in!
              </div>
              <p class="message">
                  You can now proceed to login with your credentials.
              </p>
              <a href="http://localhost:4200/login" class="login-btn">Go to Login</a>
          </div>
      </body>
      </html>
    `;
    
    res.status(200).send(successHTML);
  } catch {
    const errorHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 500px;
                  background-color: #ffffff;
                  border-radius: 15px;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                  text-align: center;
                  padding: 40px;
                  margin: 20px;
              }
              .error-icon {
                  font-size: 80px;
                  color: #dc3545;
                  margin-bottom: 20px;
              }
              h1 {
                  color: #333;
                  font-size: 28px;
                  margin-bottom: 15px;
                  font-weight: 300;
              }
              .message {
                  color: #666;
                  font-size: 16px;
                  margin-bottom: 30px;
                  line-height: 1.6;
              }
              .back-btn {
                  display: inline-block;
                  padding: 15px 35px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 50px;
                  font-size: 16px;
                  font-weight: 600;
                  transition: transform 0.2s ease;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              }
              .back-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="error-icon">❌</div>
              <h1>Verification Failed</h1>
              <p class="message">
                  Sorry, the verification link is invalid or has expired. Please try signing up again or contact support if the problem persists.
              </p>
              <a href="http://localhost:4200/register" class="back-btn">Back to Sign Up</a>
          </div>
      </body>
      </html>
    `;
    res.status(400).send(errorHTML);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(401).json({ message: 'Invalid credentials or not verified' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  const token = createToken(user);
  res.status(200).json({ 
    token, 
    user: { 
      id: user._id,
      name: user.name, 
      email: user.email, 
      role: user.role,
      isAdmin: user.role === 'admin', // Include isAdmin in response
      isVerified: user.isVerified
    } 
  });
};