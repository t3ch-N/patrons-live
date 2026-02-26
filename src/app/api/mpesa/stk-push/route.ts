import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, registrationId, accountReference } = body;

    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const shortCode = process.env.MPESA_SHORTCODE || '';
    const passkey = process.env.MPESA_PASSKEY || '';
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const stkPushPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
      AccountReference: accountReference || 'Tournament Registration',
      TransactionDesc: 'Golf Tournament Registration'
    };

    const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPushPayload)
    });

    const data = await response.json();

    if (data.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        message: 'STK Push sent successfully',
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.ResponseDescription || 'STK Push failed'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
