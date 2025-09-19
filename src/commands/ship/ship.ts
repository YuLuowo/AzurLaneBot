import { Command } from "../../handlers/commandHandler";
import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { getAllShips } from "../../utils/api";
import { getNationalityName, getRarityName, getShipTypeName } from "../../utils/maps";
import { getCachedShips } from "../../utils/cache";

const ShipCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("尋找對應船艦資訊")
        .addStringOption((option) =>
            option.setName("name").setDescription("輸入船艦名稱").setAutocomplete(true).setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const shipName = interaction.options.getString("name", true);

        const ships = await getAllShips();
        const ship = ships.find((s) => s.name === shipName);

        if (!ship) {
            await interaction.reply({ content: "找不到該艦船", ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(ship.name)
            .setDescription("Hi")
            .setColor(0x1e90ff)
            .setFields(
                { name: "稀有度", value: getRarityName(ship.rarity, ship.tag_list), inline: true },
                { name: "陣營", value: getNationalityName(ship.nationality), inline: true },
                { name: "艦種", value: getShipTypeName(ship.type), inline: true },
            )
            .setImage(ship.painting ? `https://cdn.imagineyuluo.com/AzurLane/TW/painting/${ship.painting.toLowerCase()}.webp` : null)
            .setFooter({ text: "AzurLane Bot" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        try {
            const ships = await getCachedShips();
            const filtered = ships
                .filter((s) => s.name.includes(focusedValue))
                .slice(0, 15);

            await interaction.respond(
                filtered.map((s) => ({ name: s.name, value: s.name }))
            );
        } catch (err) {
            console.error(err);
            await interaction.respond([]);
        }
    },
};

export default ShipCommand;
