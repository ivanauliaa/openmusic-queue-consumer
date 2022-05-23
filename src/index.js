require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const notesService = new NotesService();
  const mailsender = new MailSender();
  const listener = new Listener(notesService, mailsender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
