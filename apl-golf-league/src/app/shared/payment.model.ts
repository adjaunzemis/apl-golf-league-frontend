export interface LeagueDuesPayment {
  golfer_id: number
  year: number
  type: string
  amount_due: number
  amount_paid: number
  is_paid: number
  linked_payment_id: number
  method: string
  confirmation: string
}
