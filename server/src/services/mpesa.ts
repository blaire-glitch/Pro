import axios from 'axios';

// M-Pesa Daraja API Service
// Supports both Sandbox and Production environments

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface B2CRequest {
  phoneNumber: string;
  amount: number;
  remarks: string;
  occasion?: string;
}

class MpesaService {
  private config: MpesaConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      passkey: process.env.MPESA_PASSKEY || '',
      shortcode: process.env.MPESA_SHORTCODE || '174379',
      callbackUrl: process.env.MPESA_CALLBACK_URL || '',
      environment: (process.env.MPESA_ENV as 'sandbox' | 'production') || 'sandbox',
    };

    this.baseUrl = this.config.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  /**
   * Get OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64');

    try {
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in 1 hour, refresh 5 minutes before
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('M-Pesa OAuth error:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  /**
   * Generate timestamp for M-Pesa API
   */
  private getTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * Generate password for STK Push
   */
  private generatePassword(timestamp: string): string {
    const data = `${this.config.shortcode}${this.config.passkey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Format phone number for M-Pesa (254XXXXXXXXX)
   */
  private formatPhoneNumber(phone: string): string {
    let formatted = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      formatted = formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   * Customer will receive a prompt on their phone to enter PIN
   */
  async stkPush(request: STKPushRequest): Promise<STKPushResponse> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = this.generatePassword(timestamp);
    const phoneNumber = this.formatPhoneNumber(request.phoneNumber);

    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(request.amount),
          PartyA: phoneNumber,
          PartyB: this.config.shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: this.config.callbackUrl,
          AccountReference: request.accountReference,
          TransactionDesc: request.transactionDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('STK Push error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errorMessage || 'STK Push failed');
    }
  }

  /**
   * Query STK Push status
   */
  async querySTKStatus(checkoutRequestId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = this.generatePassword(timestamp);

    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('STK Query error:', error.response?.data || error.message);
      throw new Error('Failed to query STK status');
    }
  }

  /**
   * B2C Payment (Business to Customer)
   * For sending money to customers (refunds, payouts, etc.)
   */
  async b2cPayment(request: B2CRequest): Promise<any> {
    const accessToken = await this.getAccessToken();
    const phoneNumber = this.formatPhoneNumber(request.phoneNumber);

    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/b2c/v1/paymentrequest`,
        {
          InitiatorName: process.env.MPESA_INITIATOR_NAME,
          SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
          CommandID: 'BusinessPayment',
          Amount: Math.round(request.amount),
          PartyA: this.config.shortcode,
          PartyB: phoneNumber,
          Remarks: request.remarks,
          QueueTimeOutURL: `${this.config.callbackUrl}/timeout`,
          ResultURL: `${this.config.callbackUrl}/b2c/result`,
          Occasion: request.occasion || '',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('B2C Payment error:', error.response?.data || error.message);
      throw new Error('B2C Payment failed');
    }
  }

  /**
   * Process STK Push callback
   */
  processCallback(callbackData: any): {
    success: boolean;
    transactionId?: string;
    amount?: number;
    phoneNumber?: string;
    receiptNumber?: string;
    errorMessage?: string;
  } {
    const { Body } = callbackData;
    
    if (!Body || !Body.stkCallback) {
      return { success: false, errorMessage: 'Invalid callback data' };
    }

    const { ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    if (ResultCode !== 0) {
      return { success: false, errorMessage: ResultDesc };
    }

    // Extract metadata
    const metadata: Record<string, any> = {};
    if (CallbackMetadata?.Item) {
      CallbackMetadata.Item.forEach((item: any) => {
        metadata[item.Name] = item.Value;
      });
    }

    return {
      success: true,
      transactionId: metadata.MpesaReceiptNumber,
      amount: metadata.Amount,
      phoneNumber: metadata.PhoneNumber?.toString(),
      receiptNumber: metadata.MpesaReceiptNumber,
    };
  }
}

export const mpesaService = new MpesaService();
export default mpesaService;
