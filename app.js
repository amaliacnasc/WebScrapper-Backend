import axios from 'axios';
import * as cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3001;

// Verifica se a senha do e-mail está definida no ambiente
const SENHA = process.env.SENHA;
if (!SENHA) {
  console.error("Erro: a variável de ambiente 'SENHA' não está definida.");
  process.exit(1);
}

app.use(cors());
app.use(express.json()); // Permite ler JSON no corpo das requisições

const URL = 'https://www.folhape.com.br/economia/';

async function getNews() {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);
    const articles = [];

    $('.grid_4').each((index, element) => {
      if (index < 5) {
        const title = $(element).find('a').attr('title');
        const titleURL = $(element).find('a').attr('href');
        if (title && titleURL) {
          articles.push({ title, titleURL });
        }
      }
    });

    if (articles.length === 0) {
      throw new Error("Nenhuma notícia encontrada na página.");
    }

    return articles;
  } catch (error) {
    console.error("Erro ao obter as notícias:", error.message);
    throw new Error("Erro ao obter as notícias.");
  }
}

async function sendEmail(recipientEmail, newsList) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'economianoticias4@gmail.com',
      pass: SENHA
    }
    
  }
);
console.log('chegou no send email')

  let emailContent = 'Aqui estão as últimas notícias de economia:\n\n';
  newsList.forEach((news, index) => {
    emailContent += `${index + 1}. ${news.title}\nLink: https://www.folhape.com.br${news.titleURL}\n\n`;
  });

  const mailOptions = {
    from: 'economianoticias4@gmail.com',
    to: recipientEmail,
    subject: 'Top 5 Notícias de Economia',
    text: emailContent,
    
  };
  console.log('mail options')

  try {
    await transporter.sendMail(mailOptions);
    console.log('chegou no transporter')
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error.message);
    throw new Error("Erro ao enviar o e-mail.");
  }
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
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
