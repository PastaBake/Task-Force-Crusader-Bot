/*
 *  file: lib.js
 *  authors: PastaBake & skirmishuk
 *  copyright © 2024, all rights reserved
 */

const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

const Colours = {
  YELLOW: 0xf1b937,
  GREEN: 0x208150,
  RED: 0xD04437,
  PURPLE: 0x7058A4,
  GREY: 0x45474b,
};

async function handleGoingButton(interaction) {
  const client = interaction.client;
  const { attenders, neglectors, maybes } = client;

  try {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member) {
      console.log(`Member with ID ${interaction.user.id} not found.`);
      return; // Exit if the member is not found
    }

    //-- They changed their mind
    if (neglectors.has(interaction.user.id)) {
      neglectors.delete(interaction.user.id)
    }

    if (maybes.has(interaction.user.id)) {
      maybes.delete(interaction.user.id)
    }

    //--- Add to attenders
    if (attenders.get(interaction.user.id)) {
      attenders.delete(interaction.user.id)
    } else {
      attenders.set(interaction.user.id, interaction.user.displayName)
    }
    
    // Grab the original message
    const message = interaction.message;

    const embeds = message.embeds;
    if (embeds.length === 0) {
      const embed = {
          title: "Error",
          description: "Failed to find the event embed.",
          color: Colours.RED,
      };
    
      await interaction.followUp({ embeds: [embed], ephemeral: true });
      console.log(`${interaction.user.globalName} couldn't find the event embed`);
      return; // Exit early to prevent further processing
    }
    
    //-- Clone the first embed for modification
    const embed = EmbedBuilder.from(embeds[0]);
    
    //-- Fetch current members from the interaction's guild
    const members = await interaction.guild.members.fetch();
    const currentmembers = members.filter(member => !member.user.bot);
    const acceptButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👍",
      label: "Attending",
      custom_id: "attender"
    };

    const denyButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👎",
      label: "Not Attending",
      custom_id: "neglector"
    };

    const maybeButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "❓",
      label: "Maybe Attending",
      custom_id: "maybe"
    };

    const editButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "✏️",
      label: "Edit",
      custom_id: "edit"
    };

    const deleteButton = {
      type: 2,
      style: ButtonStyle.Danger,
      emoji: "🗑️",
      label: `Cancel`,
      custom_id: "deleteevent"
    };

    const actionRow = {
      type: 1,
      components: [acceptButton, denyButton, maybeButton, editButton, deleteButton]
    };

    const attendersCount = attenders.size;
    const nonattendersCount = neglectors.size;
    const maybesCount = maybes.size;

    var attederssNames = "N/A"
    if (attenders.size !== 0) {
      attederssNames = Array.from(attenders.values())
        .map(value => "👍 " + value + '\n')
        .join('')
    };

    var neglectorsNames = "N/A"
    if (neglectors.size !== 0) {
      neglectorsNames = Array.from(neglectors.values())
        .map(value => "👎 " + value + '\n')
        .join('')
    };

    var maybesNames = "N/A"
    if (maybes.size !== 0) {
      maybesNames = Array.from(maybes.values())
        .map(value => "❓ " + value + '\n')
        .join('')
    };

    //-- Update the embed fields
    embed
      .spliceFields(5, 1, { name: `Going (${attendersCount}/${currentmembers.size})`, value: attederssNames, inline: true }) 
      .spliceFields(6, 1, { name: `Not Going (${nonattendersCount}/${currentmembers.size})`, value: neglectorsNames, inline: true })
      .spliceFields(7, 1, { name: `Maybe (${maybesCount}/${currentmembers.size})`, value: maybesNames, inline: true });
    
    interaction.update({ embeds: [embed], components: [actionRow] });
  } catch(error) {
    console.log(error);
  }
}

async function handleNotGoingButton(interaction) {
  const client = interaction.client;
  const { attenders, neglectors, maybes } = client;

  try {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member) {
      console.log(`Member with ID ${interaction.user.id} not found.`);
      return; // Exit if the member is not found
    }

    //-- They changed their mind
    if (attenders.has(interaction.user.id)) {
      attenders.delete(interaction.user.id)
    }

    if (maybes.has(interaction.user.id)) {
      maybes.delete(interaction.user.id)
    }

    //--- Add to neglectors
    if (neglectors.get(interaction.user.id)) {
      neglectors.delete(interaction.user.id)
    } else {
      neglectors.set(interaction.user.id, interaction.user.displayName)
    }
    
    // Grab the original message
    const message = interaction.message;
    const embeds = message.embeds;

    if (embeds.length === 0) {
      const embed = {
        title: "Error",
        description: "Failed to find the event embed.",
        color: Colours.RED,
      };
    
      await interaction.followUp({ embeds: [embed], ephemeral: true });
      console.log(`${interaction.user.globalName} couldn't find the event embed`);
      return; // Exit early to prevent further processing
    }
    
    //-- Clone the first embed for modification
    const embed = EmbedBuilder.from(embeds[0]);
    
    //-- Fetch current members from the interaction's guild
    const members = await interaction.guild.members.fetch();
    const currentmembers = members.filter(member => !member.user.bot);
    
    //-- Prepare the values for the embed fields
    const acceptButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👍",
      label: "Attending",
      custom_id: "attender"
    };

    const denyButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👎",
      label: "Not Attending",
      custom_id: "neglector"
    };

    const maybeButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "❓",
      label: "Maybe Attending",
      custom_id: "maybe"
    };

    const editButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "✏️",
      label: "Edit",
      custom_id: "edit"
    };

    const deleteButton = {
      type: 2,
      style: ButtonStyle.Danger,
      emoji: "🗑️",
      label: `Cancel`,
      custom_id: "deleteevent"
    };

    const actionRow = {
      type: 1,
      components: [acceptButton, denyButton, maybeButton, editButton, deleteButton]
    };

    const attendersCount = attenders.size;
    const nonattendersCount = neglectors.size;
    const maybesCount = maybes.size;

    var attederssNames = "N/A"
    if (attenders.size !== 0) {
      attederssNames = Array.from(attenders.values())
        .map(value => "👍 " + value + '\n')
        .join('')
    };

    var neglectorsNames = "N/A"
    if (neglectors.size !== 0) {
      neglectorsNames = Array.from(neglectors.values())
        .map(value => "👎 " + value + '\n')
        .join('')
    };

    var maybesNames = "N/A"
    if (maybes.size !== 0) {
      maybesNames = Array.from(maybes.values())
        .map(value => "❓ " + value + '\n')
        .join('')
    };

    //-- Update the embed fields
    embed
      .spliceFields(5, 1, { name: `Going (${attendersCount}/${currentmembers.size})`, value: attederssNames, inline: true }) 
      .spliceFields(6, 1, { name: `Not Going (${nonattendersCount}/${currentmembers.size})`, value: neglectorsNames, inline: true })
      .spliceFields(7, 1, { name: `Maybe (${maybesCount}/${currentmembers.size})`, value: maybesNames, inline: true });
    
    interaction.update({ embeds: [embed], components: [actionRow] });
  } catch(error) {
    console.log(error);
  }
}

async function handleMaybeButton(interaction) {
  const client = interaction.client;
  const { attenders, neglectors, maybes } = client;

  try {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member) {
      console.log(`Member with ID ${interaction.user.id} not found.`);
      return; // Exit if the member is not found
    }

    if (attenders.has(interaction.user.id)) {
      attenders.delete(interaction.user.id)
    }

    if (neglectors.has(interaction.user.id)) {
      neglectors.delete(interaction.user.id)
    }

    //--- Add to maybes
    if (maybes.get(interaction.user.id)) {
      maybes.delete(interaction.user.id)
    } else {
      maybes.set(interaction.user.id, interaction.user.displayName)
    }

    // Grab the original message
    const message = interaction.message;
    const embeds = message.embeds;
    if (embeds.length === 0) {
        const embed = {
            title: "Error",
            description: "Failed to find the event embed.",
            color: Colours.RED,
        };
    
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        console.log(`${interaction.user.globalName} couldn't find the event embed`);
        return; // Exit early to prevent further processing
    }
    
    //-- Clone the first embed for modification
    const embed = EmbedBuilder.from(embeds[0]);
    
    //-- Fetch current members from the interaction's guild
    const members = await interaction.guild.members.fetch();
    const currentmembers = members.filter(member => !member.user.bot);
    
    const acceptButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👍",
      label: "Attending",
      custom_id: "attender"
    };

    const denyButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👎",
      label: "Not Attending",
      custom_id: "neglector"
    };

    const maybeButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "❓",
      label: "Maybe Attending",
      custom_id: "maybe"
    };

    const editButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "✏️",
      label: "Edit",
      custom_id: "edit"
    };

    const deleteButton = {
      type: 2,
      style: ButtonStyle.Danger,
      emoji: "🗑️",
      label: `Cancel`,
      custom_id: "deleteevent"
    };

    const actionRow = {
      type: 1,
      components: [acceptButton, denyButton, maybeButton, editButton, deleteButton]
    };

    //-- Prepare the values for the embed fields
    const attendersCount = attenders.size;
    const nonattendersCount = neglectors.size;
    const maybesCount = maybes.size;

    var attederssNames = "N/A"
    if (attenders.size !== 0) {
      attederssNames = Array.from(attenders.values())
        .map(value => "👍 " + value + '\n')
        .join('')
    };

    var neglectorsNames = "N/A"
    if (neglectors.size !== 0) {
      neglectorsNames = Array.from(neglectors.values())
        .map(value => "👎 " + value + '\n')
        .join('')
    };

    var maybesNames = "N/A"
    if (maybes.size !== 0) {
      maybesNames = Array.from(maybes.values())
        .map(value => "❓ " + value + '\n')
        .join('')
    };

    //-- Update the embed fields
    embed
      .spliceFields(5, 1, { name: `Going (${attendersCount}/${currentmembers.size})`, value: attederssNames, inline: true }) 
      .spliceFields(6, 1, { name: `Not Going (${nonattendersCount}/${currentmembers.size})`, value: neglectorsNames, inline: true })
      .spliceFields(7, 1, { name: `Maybe (${maybesCount}/${currentmembers.size})`, value: maybesNames, inline: true });
    
    interaction.update({ embeds: [embed], components: [actionRow] });
  } catch (error) {
    console.log(error)
  }
}

async function handleEditButton(interaction) {
  try {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member) {
      console.log(`Member with ID ${interaction.user.id} not found.`);
      return; // Exit if the member is not found
    }
    
    if (!hasRole(member, "Event Management")) {
      const embed = {
        title: "Error",
        description: "You don't have the correct permissions to `edit` events.",
        color: Colours.RED, // Green color for success
      };
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Grab the original message
    const message = interaction.message;
    const embeds = message.embeds;

    if (embeds.length === 0) {
      const embed = {
        title: "Error",
        description: "Failed to find the event embed.",
        color: Colours.RED,
      };
    
      await interaction.followUp({ embeds: [embed], ephemeral: true });
      console.log(`${interaction.user.globalName} couldn't find the event embed`);
      return; // Exit early to prevent further processing
    }
    
    //-- Clone the first embed for modification
    const embed = EmbedBuilder.from(embeds[0]);
    const event = new ModalBuilder({
      customId: `eventedit-${interaction.user.id}`,
      title: `Editing ${embed.data.title}`,
    });

    const name = new TextInputBuilder({
      customId: "name",
      label: "Title",
      style: TextInputStyle.Short,
      required: true,
      maxLength: 35,
      minLength: 4,
      placeholder: "Persistant Server Gaming",
    });

    const description = new TextInputBuilder({
      customId: "description",
      label: "Description",
      style: TextInputStyle.Paragraph,
      required: false,
      maxLength: 4000,
      minLength: 100,
      placeholder: "Let's hop on the persistant server!",
    });

    //--- Components
    const nameRow = new ActionRowBuilder().addComponents(name);
    const descriptionRow = new ActionRowBuilder().addComponents(description);

    event.addComponents(nameRow, descriptionRow);

    // Check if the interaction has already been replied to
    if (!interaction.replied) {
      await interaction.showModal(event);
      const filter = (interaction) => interaction.customId === `eventedit-${interaction.user.id}`;
        interaction
          .awaitModalSubmit({ filter, time: 10e+8 })
          .then(() => {
            console.log(`${interaction.user.globalName} has edited an event`);
        });
    } else {
      console.log(`Interaction already replied for user: ${interaction.user.globalName}`);
    }
  } catch (error) {
    console.log(error)
  }
}

async function handleEventEdited(interaction) {
  try {
    const message = interaction.message;
    const embeds = message.embeds;

    if (embeds.length === 0) {
      const embed = {
        title: "Error",
        description: "Failed to find the event embed.",
        color: Colours.RED,
      };
    
      await interaction.followUp({ embeds: [embed], ephemeral: true });
      console.log(`${interaction.user.globalName} couldn't find the event embed`);
      return; // Exit early to prevent further processing
    }
    
    //-- Clone the first embed for modification
    const embed = EmbedBuilder.from(embeds[0]);
    const titleValue = interaction.fields.getTextInputValue("name");
    const breifValue = interaction.fields.getTextInputValue("description");
    const acceptButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👍",
      label: "Attending",
      custom_id: "attender"
    };

    const denyButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👎",
      label: "Not Attending",
      custom_id: "neglector"
    };

    const maybeButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "❓",
      label: "Maybe Attending",
      custom_id: "maybe"
    };

    const editButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "✏️",
      label: "Edit",
      custom_id: "edit"
    };

    const deleteButton = {
      type: 2,
      style: ButtonStyle.Danger,
      emoji: "🗑️",
      label: `Cancel`,
      custom_id: "deleteevent"
    };

    const actionRow = {
      type: 1,
      components: [acceptButton, denyButton, maybeButton, editButton, deleteButton]
    };

    //-- Update the embed fields
    embed
      .setTitle(titleValue)
      .setDescription(breifValue);
    
    interaction.update({ embeds: [embed], components: [actionRow] });
  } catch (error) {
    console.log(error)
  }
}

async function handleDeleteEventButton(interaction) {
  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const client = interaction.client;
    const { attenders, neglectors, maybes } = client;
    const { guild, attendancechannelid } = require("./config");

    //-- Clone the first embed for modification
    if (!hasRole(member, "Company HQ")) {
      const embed = {
        title: "Error",
        description: "You don't have the necessory permissions to `delete` events.",
        color: Colours.RED, // Green color for success
      };
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const channel = await client.channels.fetch(attendancechannelid);
    const fetchedMessages = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(fetchedMessages, true);

    const discordGuild = client.guilds.cache.get(guild);
    discordGuild.scheduledEvents.fetch()
        .then(events => {
        if (events.size === 0) {
            console.log('No events found.');
            return;
        };

        console.log(`Found ${events.size} event(s). Deleting them...`);

        // Iterate through the events and delete them
        events.forEach(event => {
            discordGuild.scheduledEvents.delete(event.id)
            .then(() => console.log(`Deleted event: ${event.name} (${event.id})`))
            .catch(error => console.error(`Failed to delete event: ${event.name} (${event.id})`, error));
        });
    }).catch(error => console.error('Failed to fetch events:', error));

    console.log('All events have been deleted');
  
    attenders.clear();
    neglectors.clear();
    maybes.clear();
  } catch (error) {
    console.log(error)
  }
}

async function handleEventCreation(interaction) {
  try {
    const client = interaction.client;
    const { attendancechannelid } = require('./config');
    const { attenders } = client;
    const channel = client.channels.cache.get(attendancechannelid);
    if (!channel) {
      console.error('Channel not found:', attendancechannelid);
      return;
    }
   
    if (attenders.size > 0) {
      const embed = {
        title: "Error",
        description: `There is an event active already`,
        color: Colours.RED, // Green color for success
      };
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
  
    const nameValue = interaction.fields.getTextInputValue("name");
    const descriptionValue = interaction.fields.getTextInputValue("description");
    const timeValue = interaction.fields.getTextInputValue("time");

    //--- Make timeValue into a date object
    const unixTimestamp = parseInt(timeValue, 10);
    if (isNaN(unixTimestamp)) {
      const embed = {
        title: "Error",
        description: `There was an error with your timestamp!`,
        color: Colours.RED,
      };
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return
    };

    const roleidtopingValue = interaction.fields.getTextInputValue("roleidtoping");
    const pingEveryone = interaction.fields.getTextInputValue("everyone");
    const discordGuild = interaction.guild;

    //--- Give the user a resonse
    const embed = {
      title: "Event Created",
      description: `Take a look at it in the <#${attendancechannelid}>.`,
      color: Colours.GREY,
    };
    await interaction.reply({ embeds: [embed], ephemeral: true });

    //--- Post in the event channel
    const members = await discordGuild.members.fetch();
    const currentmembers = members.filter(member => !member.user.bot);
    
    const userid = interaction.user.id;
    const embedContents = {
      title: `${nameValue}`,
      description: `${descriptionValue}`,
      color: Colours.GREY,
      thumbnail: {
        url: 'https://i.imgur.com/bwRSo19.png',
      },
      fields: [
        { name: "Created", value: `By <@${userid}>`, inline: true },
        { name: "Time", value: `at <t:${timeValue}:t>, happening <t:${timeValue}:R>`, inline: true },
        { name: "", value: "", inline: false },
        { name: "", value: "", inline: false },
        { name: "", value: "", inline: false },
        { name: `Going (0/${currentmembers.size})`, value: "N/A", inline: true },
        { name: `Not Going (0/${currentmembers.size})`, value: "N/A", inline: true },
        { name: `Maybe (0/${currentmembers.size})`, value: "N/A", inline: true },
      ],
    };
  
    //-- Create buttons for accept and deny
    const acceptButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👍",
      label: "Attending",
      custom_id: "attender"
    };

    const denyButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "👎",
      label: "Not Attending",
      custom_id: "neglector"
    };

    const maybeButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "❓",
      label: "Maybe Attending",
      custom_id: "maybe"
    };

    const editButton = {
      type: 2,
      style: ButtonStyle.Primary,
      emoji: "✏️",
      label: "Edit",
      custom_id: "edit"
    };

    const deleteButton = {
      type: 2,
      style: ButtonStyle.Danger,
      emoji: "🗑️",
      label: `Cancel`,
      custom_id: "deleteevent"
    };

    const actionRow = {
      type: 1,
      components: [acceptButton, denyButton, maybeButton, editButton, deleteButton]
    };
  
    //--- Ping everyone
    var pingcontent = "";
    if (pingEveryone.toLowerCase() === "yes") {
      if (roleidtopingValue === "") {
        pingcontent = "@everyone"
      } else {
        pingcontent = `<@&${roleidtopingValue}>`
      }
    };
    
    const scheduledStartTime = new Date(unixTimestamp * 1000);
    const scheduledEndTime = new Date((unixTimestamp + 7200) * 1000);
    
    //--- Create an Event
    discordGuild.scheduledEvents.create({
      name: `${nameValue}`,
      scheduledStartTime: scheduledStartTime,
      scheduledEndTime: scheduledEndTime,
      privacyLevel: 2,
      entityType: 3,
      entityMetadata: {
        location: 'https://discord.gg/Xmz8UJkX94',
      },
      description: `${descriptionValue}`
    });
  
    //--- Send message and then once sent run a timer for that message
    await channel.send({ content: pingcontent, embeds: [embedContents], components: [actionRow] }).then((message) => {
      let tenMinuteWarning = false;
      let eventOver = false;

      const intervalId = setInterval(async() => {
        const targetTime = timeValue * 1000;
        const currentTime = Date.now();
        const { attenders, maybes, neglectors } = interaction.client;
  
        if (!channel) return;
  
        // Fetch the embed from the message
        const embedIsValid = isEmbedValid(message.embeds[0]);
        if (!embedIsValid) {
          console.log('Embed is no longer valid. Cancelling interval.');
          clearInterval(intervalId);
          return;
        };
  
        // Prepare the list of attenders
        let attendersList = '';
  
        // Fetch and resolve the users from the attenders map
        for (const userid of attenders.keys()) {
          const user = await interaction.guild.members.fetch(userid); // Fetch user by ID using the guild context
          if (user) {
            attendersList += `<@${user.id}> `;
          } else {
            console.log(`Couldn't find the user with the id of ${userid}`);
          }
        }

        // Check if we're 10 minutes (600000 ms) away from the target time
        if (targetTime - currentTime <= 600000 && !tenMinuteWarning) {
          tenMinuteWarning = true;
          
          const embed = EmbedBuilder.from(message.embeds[0]);
          const embedTenMin = {
            title: "Event Reminder",
            description: `*${embed.data.title}* will start in **10 Minutes**`,
            color: Colours.PURPLE,
          };
          
          //--- Only send 10 minute reminder when people are attending
          if (attenders.size > 0) {
            await message.reply({
              content: attendersList,
              embeds: [embedTenMin],
            });
          };
        }
  
        // Check if the event is starting now
        if (targetTime - currentTime <= 0 && !eventOver) {
          clearInterval(intervalId);
          eventOver = true;
          
          const embed = EmbedBuilder.from(message.embeds[0]);
          const embedStarting = {
            title: "Event Reminder",
            description: `*${embed.data.title}* has **started**, you should have been loaded in by now!`,
            color: Colours.PURPLE,
          };

          //--- Only send event starting if people are going!
          if (attenders.size > 0) {  
            await message.reply({
              content: attendersList,
              embeds: [embedStarting],
            });
          };

          //--- 📄｜attandance-logs
          const date = new Date();
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          const channellogging = await client.channels.fetch("1305167457622818918");
          
          await message.edit({
            embeds: [embed],
            components: []
          });
          
          embed
            .setTitle(`${embed.data.title}, <t:${unixTimestamp}:D>'s Event Infomation.`)
            .setColor(Colours.GREY);

          channellogging.send({ embeds: [embed] }).then(async (message) => {
              try {
                setTimeout(async () => {
                  // Clear attenders, neglectors, and maybes
                  attenders.clear();
                  neglectors.clear();
                  maybes.clear();
            
                  // Fetch the events channel and delete messages
                  const eventschannel = await client.channels.fetch(attendancechannelid);
                  if (!eventschannel.isTextBased()) {
                    console.error('The fetched channel is not text-based');
                    return;
                  }
            
                  const fetchedMessages = await eventschannel.messages.fetch({ limit: 100 });
                  await eventschannel.bulkDelete(fetchedMessages, true);
                }, 10000);
              } catch (error) {
                console.error(error);
              }
            }).catch(console.error);
        }
      }, 10000);      
    }).catch(console.error);
  } catch (error) {
    console.log(error)
  }
}

function isEmbedValid(embed) {
  if (!embed.data.title) {
    return false;
  }

  return true
}

function hasRole(member, rolestring) {
  const role = member.roles.cache.find(role => role.name === rolestring);
  if (!role) {
    return false
  }

  return true
}

module.exports = {
  Colours,
  handleGoingButton,
  handleNotGoingButton,
  handleMaybeButton,
  handleEditButton,
  handleEventEdited,
  handleDeleteEventButton,
  isEmbedValid,
  handleEventCreation,
  hasRole,
};
