export enum PaymentMethod {
  aeonpay = 'aeonpay',
  alipay = 'alipay',
  alipayhk = 'alipayhk',
  alipayplus = 'alipayplus',
  amazonpay = 'amazonpay',
  applepay = 'applepay',
  applepay_cn = 'applepay_cn',
  atone = 'atone',
  aupay = 'aupay',
  bpi = 'bpi',
  boost = 'boost',
  creditcard = 'creditcard',
  dana = 'dana',
  docomopay = 'docomopay',
  ezlink = 'ezlink',
  felica = 'felica',
  felica_id = 'felica_id',
  felica_quickpay = 'felica_quickpay',
  felica_transport_ic = 'felica_transport_ic',
  gcash = 'gcash',
  ginkopay = 'ginkopay',
  googlepay = 'googlepay',
  hellomoney = 'hellomoney',
  jcoinpay = 'jcoinpay',
  jkopay = 'jkopay',
  kakaopay = 'kakaopay',
  linepay = 'linepay',
  merpay = 'merpay',
  naverpay = 'naverpay',
  origamipay = 'origamipay',
  paidy = 'paidy',
  paypal = 'paypal',
  paypay = 'paypay',
  rabbitlinepay = 'rabbitlinepay',
  rakutenpay = 'rakutenpay',
  tng = 'tng',
  tosspay = 'tosspay',
  truemoney = 'truemoney',
  unionpay = 'unionpay',
  wechatpay = 'wechatpay',
}

export const ALL_PAYMENTS = Object.values(PaymentMethod);

export function parsePaymentMethod(input: string | null): PaymentMethod {
  if (input && Object.values(PaymentMethod).includes(input as PaymentMethod)) {
    return input as PaymentMethod;
  }
  return PaymentMethod.linepay;
}
