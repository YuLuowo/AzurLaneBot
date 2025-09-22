import { Command } from "../../handlers/commandHandler";
import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { getAllShips, getShipSkills } from "../../utils/api";
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
        await interaction.deferReply();

        const shipName = interaction.options.getString("name", true);

        const ships = await getCachedShips();
        const ship = ships.find((s) => s.name === shipName);

        if (!ship) {
            await interaction.editReply({ content: "找不到該艦船" });
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
            .setImage(`https://cdn.imagineyuluo.com/AzurLane/TW/painting/${ship.painting.toLowerCase()}.webp`)
            .setFooter({ text: "AzurLane Bot" })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`skills:${ship.name}`)
                    .setLabel("技能")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("stats")
                    .setLabel("屬性")
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 60000
        });

        collector?.on("collect", async (i: ButtonInteraction) => {
            if (i.customId.startsWith("skills:")) {
                try {
                    await i.deferReply();

                    const shipName = i.customId.split(":")[1];
                    const data = await getShipSkills(shipName);
                    const skills = data.skills;
                    const skillEmbed = new EmbedBuilder()
                        .setTitle(`${shipName} 的技能`)
                        .setColor(0x00ff00);

                    skills.forEach(s => {
                        skillEmbed.addFields({ name: s.name, value: s.desc, inline: false });
                    });

                    await i.editReply({ embeds: [skillEmbed] });
                } catch (err) {
                    console.error(err);
                    if (i.deferred) {
                        await i.editReply({ content: "技能資料抓取失敗" });
                    }
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
