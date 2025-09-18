import { Command } from '../../handlers/commandHandler'
import { SlashCommandBuilder } from "discord.js";

const PingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('pong!');
    }
}

export default PingCommand;