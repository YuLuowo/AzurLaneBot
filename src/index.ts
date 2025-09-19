import { CLIENT_ID, DISCORD_TOKEN } from "./config";
import { Client, GatewayIntentBits, Collection, Interaction } from "discord.js";
import { readdirSync } from "node:fs";
import { Command } from "./handlers/commandHandler";
import { registerCommand } from "./register";

const path = require("path");

interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
const commandFolders = readdirSync(path.join(__dirname, "commands"));

for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, "commands", folder))
        .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, "commands", folder, file))
            .default;

        console.log(`Loading CommandFile: ${file}`);

        if (!command?.data?.name) {
            console.error(`Command in file ${file} is missing a 'data.name' property.`);
            continue;
        }

        client.commands.set(command.data.name, command);
    }
}

client.once("ready", async () => {
    console.log(`${client.user?.username} is online!`);
    await registerCommand();
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this commands!', ephemeral: true });
        }
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
            await interaction.respond([]);
        }
    }

});

client.login(DISCORD_TOKEN);