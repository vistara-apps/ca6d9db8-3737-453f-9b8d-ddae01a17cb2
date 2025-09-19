import { MiniKit } from '@coinbase/minikit';

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class BaseClient {
  private miniKit: typeof MiniKit;

  constructor() {
    this.miniKit = MiniKit;
  }

  /**
   * Check if user has MiniKit available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && this.miniKit.isInstalled();
  }

  /**
   * Connect to user's wallet
   */
  async connectWallet(): Promise<{ address: string } | null> {
    try {
      if (!this.isAvailable()) {
        throw new Error('MiniKit not available');
      }

      const result = await this.miniKit.connectWallet();
      if (result.address) {
        return { address: result.address };
      }
      return null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }

  /**
   * Send a micro-transaction (for future premium features)
   */
  async sendMicroTransaction(
    to: string,
    amount: string,
    data?: string
  ): Promise<TransactionResult> {
    try {
      if (!this.isAvailable()) {
        return {
          success: false,
          error: 'MiniKit not available'
        };
      }

      const result = await this.miniKit.sendTransaction({
        to,
        value: amount,
        data
      });

      if (result.success) {
        return {
          success: true,
          transactionHash: result.transactionHash
        };
      } else {
        return {
          success: false,
          error: result.error || 'Transaction failed'
        };
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Sign a message (for future authentication)
   */
  async signMessage(message: string): Promise<{ signature: string } | null> {
    try {
      if (!this.isAvailable()) {
        throw new Error('MiniKit not available');
      }

      const result = await this.miniKit.signMessage({ message });
      if (result.signature) {
        return { signature: result.signature };
      }
      return null;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }

  /**
   * Get user's wallet balance
   */
  async getBalance(): Promise<string | null> {
    try {
      if (!this.isAvailable()) {
        return null;
      }

      const wallet = await this.miniKit.getWallet();
      if (wallet?.address) {
        // This would need to be implemented with a provider
        // For now, return a placeholder
        return '0.0';
      }
      return null;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }

  /**
   * Check if user can make transactions
   */
  canTransact(): boolean {
    return this.isAvailable() && this.miniKit.isConnected();
  }

  /**
   * Get supported networks
   */
  getSupportedNetworks(): string[] {
    return ['base', 'base-sepolia'];
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: string, decimals: number = 18): string {
    const value = parseFloat(amount) / Math.pow(10, decimals);
    return value.toFixed(4);
  }

  /**
   * Convert ETH to wei
   */
  ethToWei(eth: string): string {
    const wei = parseFloat(eth) * Math.pow(10, 18);
    return wei.toString();
  }

  /**
   * Convert wei to ETH
   */
  weiToEth(wei: string): string {
    const eth = parseFloat(wei) / Math.pow(10, 18);
    return eth.toFixed(6);
  }
}

