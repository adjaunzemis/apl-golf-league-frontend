export interface LeagueDuesPayment {
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
