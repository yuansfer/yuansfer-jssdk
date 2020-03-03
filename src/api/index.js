import request from '../request'

export function securePay(params) {
  return request({
    url: '/online/v2/secure-pay',
    method: 'post',
    data: {
      merchantNo: params.merchantNo,        //required  string	商户号
      storeNo: params.storeNo,              //required  string	店铺号
      amount: params.amount,                //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
      rmbAmount: params.rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
      currency: params.currency,            //required  enum	    币种 目前仅支持: "USD"
      vendor: params.vendor,                //required  enum	    支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
      ipnUrl: params.ipnUrl,                //required  string	异步通知url地址
      callbackUrl: params.callbackUrl,      //required  string	同步回调url地址。同步回调地址支持宏替换规则 xxxcallback_url?trans_no={amount}&amount={amount}, Yuansfer系统会替换{}中的内容.
      terminal: params.terminal,            //required  enum	    客户端类型 包括: "ONLINE", "WAP".
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      description: params.description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
      note: params.note,                    //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
      timeout: params.timeout,              //optional  integer	超时时间 默认120，单位分钟
      goodsInfo: params.goodsInfo,          //required  string	订单商品信息，使用JSON格式，不支持特殊字符 例如: [{"goods_name":"name1","quantity":"quantity1"},{"goods_name":"name2","quantity":"quantity2"}]
      creditType: params.creditType,        //optional  string	信用卡支付类型，只有当vendor=creditcard时需要 包括: "normal"（普通支付）, "recurring"（自动扣款）. 默认为 "normal"
      paymentCount: params.paymentCount,    //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要 0 表示无截止日期
      frequency: params.frequency,          //optional  integer	自动扣款频率，只有当vendor=creditcard, creditType=recurring时需要 单位'天'
      // verifySign: params.verifySign         //required  string	数字签名    //request 统一计算
    }
  })
}
