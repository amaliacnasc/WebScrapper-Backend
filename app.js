import axios from 'axios';
import * as cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Permite ler JSON no corpo das requisições

const URL = 'https://www.folhape.com.br/economia/';
const SENHA = process.env.senha

async function getNews() {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);
    const articles = [];

    $('.grid_4').each((index, element) => {
      if (index < 5) {
        const title = $(element).find('a').attr('title');
        const titleURL = $(element).find('a').attr('href');
        articles.push({ title, titleURL });
      }
    });

    return articles;
  } catch (error) {
    console.error(error);
  }
}

async function sendEmail(recipientEmail, newsList) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'economianoticias4@gmail.com',
      pass: SENHA   
    }
  });

  let emailContent = 'Aqui estão as últimas notícias:\n\n';
  newsList.forEach((news, index) => {
    emailContent += `${index + 1}. ${news.title}\nLink: ${news.titleURL}\n\n`;
  });

  const mailOptions = {
    from: 'economianoticias4@gmail.com',
    to: recipientEmail,
    subject: 'Top 5 Notícias de Economia',
    text: emailContent
  };

  return transporter.sendMail(mailOptions);
}

// Rota para receber o email e enviar as notícias
app.post('/send-news', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newsList = await getNews();
    await sendEmail(email, newsList);
    res.status(200).json({ message: 'Notícias enviadas com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
