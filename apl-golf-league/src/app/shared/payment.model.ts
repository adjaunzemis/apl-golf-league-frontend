export interface LeagueDues {
  id: number
  year: number
  type: string
  amount: number
}

export interface LeagueDuesPaymentInfo {
  id: number
  golfer_id: number
  golfer_name: string
  year: number
  type: string
  amount_due: number
  amount_paid: number
  is_paid: number
}

export interface LeagueDuesPaymentData {
  id: number
  golfer_id: number
  golfer_name: string
  golfer_email: string
  year: number
  type: string
  amount_due: number
  amount_paid: number
  is_paid: number
  linked_payment_id: number
  method: string
  comment: string
}

export interface LeagueDuesPaypalTransactionItem {
  id?: number
  golfer_id: number
  type: string
}

export interface LeagueDuesPaypalTransaction {
  year: number
  amount: number
  description: string
  items: LeagueDuesPaypalTransactionItem[]
  resource_id?: string
  update_time?: string
  payer_name?: string
  payer_email?: string
}
