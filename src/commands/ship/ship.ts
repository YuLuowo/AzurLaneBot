import { Command } from "../../handlers/commandHandler";
import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import {getAllShips, getShipSkills} from "../../utils/api";
import {getNationalityName, getRarityName, getShipTypeName} from "../../utils/maps";

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
            .setImage(ship.painting ? `https://cdn.imagineyuluo.com/AzurLane/TW/painting/${ship.painting}.webp` : null)
            .setFooter({ text: "AzurLane Bot" })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("skills")
                    .setLabel("技能")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("stats")
                    .setLabel("屬性")
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 60000
        });

        collector?.on("collect", async (i: ButtonInteraction) => {
            if (i.customId === "skills") {
                try {
                    if (!i.deferred && !i.replied) {
                        await i.deferReply({ ephemeral: true });
                    }

                    const data = await getShipSkills(ship.name);
                    const skills = data.skills;
                    const skillEmbed = new EmbedBuilder()
                        .setTitle(`${ship.name} 的技能`)
                        .setColor(0x00ff00);

                    skills.forEach(s => {
                        skillEmbed.addFields({ name: s.name, value: s.desc, inline: false });
                    });

                    if (i.deferred || i.replied) {
                        await i.editReply({ embeds: [skillEmbed] });
                    } else {
                        await i.reply({ embeds: [skillEmbed], ephemeral: true });
                    }
                } catch (err) {
                    console.error(err);
                    await i.reply({ content: "技能資料抓取失敗", ephemeral: true });
                }
            }
        });



    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        try {
            const ships = await getAllShips();
            const filtered = ships
                .filter((s) => s.name.includes(focusedValue))
                .slice(0, 25);

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
