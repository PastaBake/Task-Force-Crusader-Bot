/*
 *  file: index.js
 *  authors: PastaBake & skirmishuk
 *  copyright © 2024, all rights reserved
 */

const { Routes, REST, Client, Events, GatewayIntentBits, Collection } = require('discord.js');
// const { createConnection } = require('mysql');
const { CommandHandler } = require('djs-commander');
const { handleEventEdited, handleEditButton, handleGoingButton, handleNotGoingButton, handleDeleteEventButton, handleEventCreation, handleMaybeButton } = require('./lib');
const { guild, token, appid } = require('./config');
const path = require('node:path');
// const rest = new REST().setToken(token);

// rest.put(Routes.applicationCommands(appid), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);

let client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
client.attenders = new Map();
client.neglectors = new Map();
client.maybes = new Map();

//-- Interact
// Has to be here otherwise the event never gets added if
// its done for the same way as the other events
client.on(Events.InteractionCreate, async (interaction) => {
  //--- Check for right server
  const interactionguild = interaction.guild;
  if (!interactionguild) return;

  //--- Buttons
  if (interaction.isButton()) {
    switch (true) {
      case interaction.customId.startsWith(`attender`): {
        await handleGoingButton(interaction);
        break;
      }

      case interaction.customId.startsWith(`neglector`): {
        await handleNotGoingButton(interaction);
        break;
      }

      case interaction.customId.startsWith(`maybe`): {
        await handleMaybeButton(interaction);
        break;
      }

      case interaction.customId.startsWith(`edit`): {
        await handleEditButton(interaction);
        break;
      }

      case interaction.customId.startsWith(`deleteevent`): {
        await handleDeleteEventButton(interaction);
        break;
      }

      default: {
        console.log('Unknown button interaction: ', interaction.customId);
      }
    }
  }
  
  //--- Modals
  if (interaction.isModalSubmit()) {
    switch (true) {
      case interaction.customId === `event-${interaction.user.id}`: {
        await handleEventCreation(interaction);
        break;
      }

      case interaction.customId.startsWith(`eventedit`): {
        await handleEventEdited(interaction);
        break;
      }
    
      default: {
        console.log('Unknown modal interaction: ', interaction.customId);
      }
    }
  };
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
});

//-- Login
client.login(token);
