import { Client, GatewayIntentBits, TextChannel } from "discord.js";

export class DiscordService {
    public client: Client;
    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
        this.client.once("ready", () => {
            console.log("Discord bot is online");
        });

        this.client.login(process.env.DISCORD_TOKEN!);
    }
    sendMessage(message: any, channelId: any) {
        const channel = this.client.channels.cache.get(channelId);
        if (channel && channel.isTextBased()) {
            (channel as TextChannel).send(message);
        }
    }
}
