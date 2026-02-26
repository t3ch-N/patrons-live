import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Body } = body;
    const { stkCallback } = Body;

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    } = stkCallback;

    let mpesaReceiptNumber = null;
    let transactionDate = null;
    let phoneNumber = null;
    let amount = null;

    if (ResultCode === 0 && stkCallback.CallbackMetadata) {
      const items = stkCallback.CallbackMetadata.Item;
      mpesaReceiptNumber = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      transactionDate = items.find((i: any) => i.Name === 'TransactionDate')?.Value;
      phoneNumber = items.find((i: any) => i.Name === 'PhoneNumber')?.Value;
      amount = items.find((i: any) => i.Name === 'Amount')?.Value;
    }

    const { data: registration } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (registration) {
      await supabase
        .from('tournament_registrations')
        .update({
          payment_status: ResultCode === 0 ? 'completed' : 'failed',
          mpesa_receipt_number: mpesaReceiptNumber,
          paid_at: ResultCode === 0 ? new Date().toISOString() : null
        })
        .eq('id', registration.id);

      await supabase
        .from('mpesa_transactions')
        .insert({
          registration_id: registration.id,
          merchant_request_id: MerchantRequestID,
          checkout_request_id: CheckoutRequestID,
          result_code: ResultCode.toString(),
          result_desc: ResultDesc,
          amount: amount,
          mpesa_receipt_number: mpesaReceiptNumber,
          transaction_date: transactionDate ? new Date(transactionDate).toISOString() : null,
          phone_number: phoneNumber?.toString(),
          callback_received_at: new Date().toISOString()
        });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error: any) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed' }, { status: 500 });
  }
}
