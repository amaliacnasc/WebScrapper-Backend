
# Web Scraper Backend

Este projeto é uma API backend que realiza a raspagem de dados de notícias de economia e envia essas notícias por e-mail para um endereço fornecido. Ele utiliza `axios` para fazer requisições HTTP, `cheerio` para fazer parsing do HTML e `nodemailer` para enviar os e-mails.

## Tecnologias Utilizadas

- Node.js
- Express
- Axios
- Cheerio
- Nodemailer

## Tutorial

1. Crie um arquivo `.env` na raiz do projeto e adicione a seguinte variável de ambiente:
   ```plaintext
   SENHA=<SUA_SENHA_DE_APLICATIVO_DO_GMAIL>
   ```

   - **Nota**: Para contas do Gmail, a senha deve ser uma [senha de aplicativo](https://support.google.com/accounts/answer/185833) se a autenticação em duas etapas estiver ativada.

## Como Usar

### Enviar Notícias para um E-mail

1. Abra o [Postman](https://www.postman.com/) ou outra ferramenta similar de requisições HTTP.
2. Faça uma requisição POST para a seguinte URL:
   ```
   https://webscrapper-backend-na4o.onrender.com/send-news
   ```

3. No corpo da requisição, adicione seu e-mail no formato JSON:
   ```json
   {
     "email": "seuemail@exemplo.com"
   }
   ```

4. A resposta será semelhante a:
   ```json
   {
     "message": "Notícias enviadas com sucesso!"
   }
   ```

## Endpoints

- **POST /send-news**: Raspagem de notícias de economia e envio para o e-mail especificado no corpo da requisição.

## Observações

- Certifique-se de que o Gmail permite o acesso do aplicativo (`nodemailer`) configurado com as credenciais fornecidas.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo LICENSE para mais informações.
