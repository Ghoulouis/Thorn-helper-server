import { providers } from "ethers";
import { ERC20__factory, TokenPaymaster__factory } from "../../typechain-types";
import { DiscordService } from "../DiscordSerivce";
import { formatUnits } from "ethers/lib/utils";

export class PaymasterService {
    public paymasterAddress: string;
    public paymaster;
    constructor(public provider: providers.JsonRpcProvider, public discordService: DiscordService) {
        this.paymasterAddress = process.env.PAYMASTER_ADDRESS!;
        this.paymaster = TokenPaymaster__factory.connect(this.paymasterAddress, this.provider);
        this.checkAndRefill();
    }

    checkAndRefill() {
        const time = 5 * 60 * 1000;
        const usdtAddress = "0xeC240a739D04188D83E9125CECC2ea88fABd9B08";
        let lastBalance = -1;
        const intervalID = setInterval(async () => {
            // check Balance USDT
            const usdt = ERC20__factory.connect(usdtAddress, this.provider);
            const balance = Number(formatUnits(await usdt.balanceOf(this.paymasterAddress), 6));
            if (balance != lastBalance) {
                this.sendLog("balance USDT paymaster: " + balance);
                lastBalance = balance;
            }
        }, time);
    }

    sendLog(text: string) {
        const paymasterChannel = process.env.PAYMASTER_CHANNEL;
        this.discordService.sendMessage(text, paymasterChannel);
    }
}
