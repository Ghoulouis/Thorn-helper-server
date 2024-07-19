import { DiscordService } from "./DiscordSerivce";
import { PaymasterService } from "./PaymasterService";
import { providers } from "ethers";
import dotenv from "dotenv";
import { AutoLiquidtyService } from "./AutoLiquidityService";
dotenv.config();
class Server {
    public discordService: DiscordService;
    public paymasterService: PaymasterService;
    public provider: providers.JsonRpcProvider;

    public autoLiquidityService: AutoLiquidtyService;
    constructor() {
        this.provider = new providers.JsonRpcProvider(process.env.RPC_URL);
        this.discordService = new DiscordService();
        this.paymasterService = new PaymasterService(this.provider, this.discordService);
        this.autoLiquidityService = new AutoLiquidtyService(this.discordService);
    }
}

async function startServer(): Promise<void> {
    const server = new Server();
}

startServer();
