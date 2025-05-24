/*
 *  file: event.js (commands)
 *  authors: PastaBake & skirmishuk
 *  copyright © 2024, all rights reserved
 */

const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Colours, hasRole } = require('../lib');

module.exports = {
    run: async ({ interaction }) => {  
      const interactionguild = interaction.guild;
      if (!interactionguild) {
        await interaction.reply(
          { content: "You can only use this command within https://discord.gg/Xmz8UJkX94", ephemeral: true }
        );
        return;
      };
      
      const member = await interactionguild.members.fetch(interaction.user.id);
      if (!member) {
        console.log(`Member with ID ${interaction.user.id} not found.`);
        return; // Exit if the member is not found
      }

      if (!hasRole(member, "Event Management")) {
        const embed = {
          title: "Error",
          description: `You don't have the correct permissions to access **/event**.`,
          color: Colours.RED, // Green color for success
        };
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        console.log(`${interaction.user.globalName} doesn't have permission to run /event.`);
        return;
      }

      //-- Create Modal
      const event = new ModalBuilder({
        customId: `event-${interaction.user.id}`,
        title: 'Event Setup',
      });
  
      const name = new TextInputBuilder({
        customId: "name",
        label: "What's your event name?",
        style: TextInputStyle.Short,
        required: true,
        maxLength: 35,
        minLength: 4,
        placeholder: "Star Citizen Gaming",
      });

      const description = new TextInputBuilder({
        customId: "description",
        label: "What's the description?",
        style: TextInputStyle.Paragraph,
        required: false,
        maxLength: 4000,
        minLength: 100,
        placeholder: "Let's hop on Star Citizen",
      });
      
      const time = new TextInputBuilder({
        customId: "time",
        label: "When is it happening?",
        style: TextInputStyle.Short,
        required: true,
        placeholder: "for example: 1726254000",
      });

      const roleidtoping = new TextInputBuilder({
        customId: "roleidtoping",
        label: "Role ID to ping",
        style: TextInputStyle.Short,
        required: false,
        placeholder: "@everyone is used if none is provided",
      });

      const ping = new TextInputBuilder({
        customId: "everyone",
        label: "Ping everyone?",
        style: TextInputStyle.Short,
        required: true,
        placeholder: "'Yes' or 'No'",
      });

      //--- Components
      const nameRow = new ActionRowBuilder().addComponents(name);
      const descriptionRow = new ActionRowBuilder().addComponents(description);
      const timeRow = new ActionRowBuilder().addComponents(time);
      const roleidtopingRow = new ActionRowBuilder().addComponents(roleidtoping);
      const pingRow = new ActionRowBuilder().addComponents(ping);

      event.addComponents(nameRow, descriptionRow, timeRow, roleidtopingRow, pingRow);
      await interaction.showModal(event);
  
      //-- Wait for Modal
      const filter = (interaction) => interaction.customId === `event-${interaction.user.id}`;
      interaction.awaitModalSubmit({ filter, time: 10e+8 });
    },
  
    data: {
      name: 'event',
      description: 'Creates an event, with the provided information.',
    },
};
