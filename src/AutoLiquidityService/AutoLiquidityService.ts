import { ethers, providers } from "ethers";
import { ERC20__factory, TokenPaymaster__factory, VaultTestnet, VaultTestnet__factory } from "../../typechain-types";
import { DiscordService } from "../DiscordSerivce";
import { formatUnits } from "ethers/lib/utils";

export class AutoLiquidtyService {
    public paymasterAddress: string;
    public vaultLiquidity: VaultTestnet;
    public provider: providers.JsonRpcProvider;
    private running = false;
    private wallet: ethers.Wallet;
    constructor(public discordService: DiscordService) {
        this.paymasterAddress = process.env.VAULT_LIQUIDITY_ADDRESS!;
        this.provider = new providers.JsonRpcProvider(process.env.VAULY_LIQUIDITY_RPC!);
        this.vaultLiquidity = VaultTestnet__factory.connect(this.paymasterAddress, this.provider);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
        this.initAutoLiquidity();

        this.sendLog("Auto liquidity service started");
    }

    initAutoLiquidity() {
        setInterval(async () => {
            if (this.running == true) return;
            const lastTimeUpdate = await this.vaultLiquidity.lastTimeUpdate();
            if (Date.now() - Number(lastTimeUpdate) * 1000 > 65 * 1000) {
                await this.startAutoLiquidity();
            }
        }, 10000);
    }

    async startAutoLiquidity() {
        this.running = true;
        try {
            const txResponse = await this.vaultLiquidity.connect(this.wallet).updateRate();
            await txResponse.wait();
        } catch (e) {
            const text = `
            Error while updating rate
            balance ${formatUnits(await this.provider.getBalance(await this.wallet.getAddress()), 18)}
            `;
            this.sendLog("Error while updating rate");
        } finally {
            this.running = false;
        }
    }

    sendLog(text: string) {
        const paymasterChannel = process.env.LIQUIDITY_CHANNEL;
        this.discordService.sendMessage(text, paymasterChannel);
    }
}
