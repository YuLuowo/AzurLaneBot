import { REST, Routes } from 'discord.js';
import { CLIENT_ID, DISCORD_TOKEN } from "./config";
import PingCommand from "./commands/general/ping";
import ShipCommand from "./commands/ship/ship";

const clientId = CLIENT_ID;
const discordToken: string = DISCORD_TOKEN;

interface Command {
    data: {
        toJson: () => void;
    };
    execute(command: Command): Promise<void>;
}

// Add command here qwq
const commandFiles = [ PingCommand, ShipCommand ];
const commands: any[] = [];

for (const command of commandFiles) {
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST({ version: '10' }).setToken(discordToken);

export const registerCommand = async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(
            Routes.applicationGuildCommands(clientId, "1323800314511364106"),
            { body: commands },
        )

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}
