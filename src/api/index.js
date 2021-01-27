import request from '../request'

/**
 * 支付接口
 * 使用secure-pay() API进行下单，接口成功则返回收银台链接，直接跳转即可
 * V3
 * @param params
 */
function securePay(params) {
  return request({
    url: '/online/v3/secure-pay',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      amount: params.amount,                //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
      // rmbAmount: params.rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
      currency: params.currency,            //required  enum	币种 目前仅支持: "USD"
      settleCurrency: params.settleCurrency,  //	String  The settlement currency
      vendor: params.vendor,                //required  enum	支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
      ipnUrl: params.ipnUrl,                //required  string	异步通知url地址
      callbackUrl: params.callbackUrl,      //required  string	同步回调url地址。同步回调地址支持宏替换规则 xxxcallback_url?trans_no={amount}&amount={amount}, Yuansfer系统会替换{}中的内容.
      terminal: params.terminal,            //required  enum	客户端类型 包括: "ONLINE", "WAP".
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      description: params.description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
      note: params.note,                    //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
      osType: params.osType,                //String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS", "ANDROID"
      timeout: params.timeout,              //optional  integer	超时时间 默认120，单位分钟
      goodsInfo: params.goodsInfo,          //required  string	订单商品信息，使用JSON格式，不支持特殊字符 例如: [{"goods_name":"name1","quantity":"quantity1"},{"goods_name":"name2","quantity":"quantity2"}]
      creditType: params.creditType,        //optional  string	信用卡支付类型，只有当vendor=creditcard时需要 包括: "normal"（普通支付）, "recurring"（自动扣款）. 默认为 "normal"
      paymentCount: params.paymentCount,    //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要 0 表示无截止日期
      frequency: params.frequency,          //optional  integer	自动扣款频率，只有当vendor=creditcard, creditType=recurring时需要 单位'天'
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    // console.log('success', res)
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    // console.log('error', res)
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 自动扣款修改接口
 * 使用update-recurring() API修改自动扣款规则
 * V3/V2
 * @param params
 */
function updateRecurring(params) {
  return request({
    url: '/creditpay/v3/update-recurring',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      scheduleNo: params.scheduleNo,        //required  string	自动扣款规则号
      paymentCount: params.paymentCount,    //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要新的paymentCount值必须大于当前设置的值，或者设置为0表示无截止日期
      status: params.status,                //optional  enum	自动扣款状态，暂时只支持'CANCELLED'， 表示终止自动扣款
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 新增交易(商户扫码)
 * 使用 add() API 可以创建一个 商户扫码 订单
 * V3
 * @param params
 */
function add(params) {
  return request({
    url: '/app-instore/v3/add',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      amount: params.amount,                //optional  decimal	金额
      currency: params.currency,            //required  enum	币种 目前仅支持: "USD"
      settleCurrency: params.settleCurrency,  //String  The settlement currency
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      description: params.description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
      // preAuth: params.preAuth,              //optional  string	预付款标志, true表示预付款订单，false为普通订单， 默认false
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return res
  })
}

/**
 * 支付(商户扫码)
 * 使用 pay() API 将add() 所创建的订单提交支付
 * V3/V2
 * @param params
 */
function pay(params) {
  return request({
    url: '/app-instore/v3/pay',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      paymentBarcode: params.paymentBarcode, //required string	顾客支付条形码/二维码内容
      vendor: params.vendor,                //required  enum	支付渠道  包括: "alipay", "wechatpay","unionpay".
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 新增交易(用户扫码)
 * 使用 create-trans-qrcode() API 创建交易二维码，顾客可以通过扫描交易二维码完成支付
 * @param params
 */
/**
 * response
 * transactionNo	string	Yuansfer系统订单ID
 * reference	string	商户系统支付流水号
 * amount	decimal	金额
 * timeout	integer	超时时间，默认120，单位分钟
 * deepLink	string	支付宝或者微信的deepLink，即支付链接
 * qrcodeUrl	string	根据deepLink生成的二维码
 * ret_msg	string	响应信息
 * ret_code	string	响应码，更多内容参看 here.
 * @param params
 */
function createTransQrcode(params) {
  return request({
    url: '/app-instore/v3/create-trans-qrcode',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      amount: params.amount,                //optional  decimal	金额
      currency: params.currency,            //required  enum	币种 目前仅支持: "USD"
      settleCurrency: params.settleCurrency,  //String  The settlement currency
      vendor: params.vendor,
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      ipnUrl: params.ipnUrl,                //optional  string	异步通知url地址
      needQrcode: params.needQrcode,        //optional  string	值为: true 或者 false. 默认为 true.  如果值为 true, Yuansfer系统将会创建二维码图片  如果值为 false, Yuansfer系统将不会创建二维码图片
      // preAuth: params.preAuth,              //optional  string	预付款标志, true表示预付款订单，false为普通订单， 默认false
      timeout: params.timeout,              //optional  integer	超时时间 默认120，单位分钟
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 取消交易
 * 使用 reverse() API 来取消交易
 * 如果顾客还没有支付，取消订单后订单变为关闭状态，顾客也将不能继续支付
 * 如果顾客已经支付完成，取消订单后Yuansfer将原路径退款给顾客
 * V3/V2
 * @param params
 */
function reverse(params) {
  return request({
    url: '/app-instore/v3/reverse',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 *
 * 使用 auth-capture()
 * @param params
 */
function authCapture(params) {
  return request({
    url: '/app-auth/v3/auth-capture',
    method: 'post',
    data: {
      outAuthInfoNo: params.outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: params.outAuthDetailNo,  //	String  merchant system's authorization operation ID
      reference: params.reference,              //	String  The Invoice Number of the transaction in the merchant’s system
      amount: params.amount,                    //	Number    The amount to capture.
      currency: params.currency,                //	String    The price currency, possible values are 'USD'
      settleCurrency: params.settleCurrency,
      ipnUrl: params.ipnUrl,                    //	String    Asynchronous callback address
      authConfirmModel: params.authConfirmModel
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 *
 * 使用 auth-detail-query()
 * @param params
 */
function authDetailQuery(params) {
  return request({
    url: '/app-auth/v3/auth-detail-query',
    method: 'post',
    data: {
      outAuthInfoNo: params.outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: params.outAuthDetailNo,  //	String  merchant system's authorization operation ID
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}


/**
 *
 * 使用 auth-freeze()
 * @param params
 */
function authFreeze(params) {
  return request({
    url: '/app-auth/v3/auth-freeze',
    method: 'post',
    data: {
      outAuthInfoNo: params.outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: params.outAuthDetailNo,  //	String  merchant system's authorization operation ID
      amount: params.amount,                    //	Number    The amount to capture.
      currency: params.currency,                //	String    The price currency, possible values are 'USD'
      settleCurrency: params.settleCurrency,
      authIpnUrl: params.authIpnUrl,                //	String    Asynchronous callback address
      vendor: params.vendor,                    //	String    Possible values are 'alipay'
      paymentBarcode: params.paymentBarcode,     //	String    The payment barcode from the customer.
      note: params.note
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 *
 * 使用 auth-unfreeze()
 * @param params
 */
function authUnfreeze(params) {
  return request({
    url: '/app-auth/v3/auth-unfreeze',
    method: 'post',
    data: {
      outAuthInfoNo: params.outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: params.outAuthDetailNo,  //	String  merchant system's authorization operation ID
      unfreezeAmount: params.unfreezeAmount,                    //	Number    The amount to capture.
      currency: params.currency,                //	String    The price currency, possible values are 'USD'
      settleCurrency: params.settleCurrency,
      authIpnUrl: params.authIpnUrl                //	String    Asynchronous callback address
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 *
 * 使用 voucher-create()
 * @param params
 */
function voucherCreate(params) {
  return request({
    url: '/app-auth/v3/voucher-create',
    method: 'post',
    data: {
      outAuthInfoNo: params.outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: params.outAuthDetailNo,  //	String  merchant system's authorization operation ID
      amount: params.amount,                    //	Number    The amount to capture.
      currency: params.currency,                //	String    The price currency, possible values are 'USD'
      settleCurrency: params.settleCurrency,
      authIpnUrl: params.ipnUrl,                //	String    Asynchronous callback address
      vendor: params.vendor,                    //	String    Possible values are 'alipay'
      note: params.note
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 新增交易(收银机)
 * 使用 cashier-add() 接口来发送请求到圆支付后台创建订单， 同时唤醒圆支付POS
 * V3
 * @param params
 */
function cashierAdd(params) {
  return request({
    url: '/app-instore/v3/cashier-add',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      amount: params.amount,                //optional  decimal	订单美金金额
      currency: params.currency,            //required  enum	币种 目前仅支持: "USD"
      settleCurrency: params.settleCurrency,  //String  The settlement currency
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      ipnUrl: params.ipnUrl,                //optional  string	异步通知url地址
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 预付款
 * 使用 prepay() API 获得微信小程序支付能力
 * 已改V3
 * @param params
 */
function prepay(params) {
  return request({
    url: '/micropay/v3/prepay',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      amount: params.amount,                //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
      // rmbAmount: params.rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
      currency: params.currency,            //required  enum	币种 目前仅支持: "USD"
      settleCurrency: params.settleCurrency,  //	String  The settlement currency, possible values:USD
      vendor: params.vendor,                //required  enum	支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
      ipnUrl: params.ipnUrl,                //required  string	异步通知url地址
      openid: params.openid,                //optional  string	微信小程序需要用到
      reference: params.reference,          //required  string	商户系统支付流水号，要求唯一
      terminal: params.terminal,            //required  enum	客户端类型 "MINIPROGRAM","APP",vendor=alipay时暂时只支持APP
      description: params.description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
      note: params.note,                    //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
      timeout: params.timeout,              //optional  integer	超时时间 默认120，单位分钟
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * micropay接口
 * 使用express-pay() API
 * V3
 * @param params
 */
function expressPay(params) {
  return request({
    url: '/micropay/v3/express-pay',
    method: 'post',
    data: {
      amount: params.amount,      //	String  The price amount
      currency: params.currency,  //	String  The price currency, possible values: USD,CNY
      settleCurrency: params.settleCurrency,    //	String  The settlement currency, possible values:USD
      cardNumber: params.cardNumber,    //	String  Card number
      cardExpYear: params.cardExpYear,    //	String    Expiration year of the Card.
      cardExpMonth: params.cardExpMonth,    //	String    Expiration month of the Card.
      cardCvv: params.cardCvv,    //	String    Card CVV.
      reference: params.reference,    //	Stirng    The Invoice Number of the transaction in the merchant’s system.
      clientIp: params.clientIp,      //	String    The IP of merchant’s system.
      // verifySign: params.verifySign	//String  The parameter signature.
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 退款接口
 * 使用refund() API进行在线支付退款
 * 已改V3
 * @param params
 */
function refund(params) {
  return request({
    url: '/app-data-search/v3/refund',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      refundAmount: params.refundAmount,       //String  The refund amount in price currency
      currency: params.currency,              //String  The three-character currency code that identifies the currency.The possible values are: "USD".
      settleCurrency: params.settleCurrency,  //String  The settlement currency
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
      refundReference: params.refundReference,//optional  string	商户系统退款流水号
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 订单查询接口
 * 使用tran-query() API 可以根据商户系统支付流水号查询Yuansfer系统中关联订单的信息
 * V3/V2
 * @param params
 */
function tranQuery(params) {
  return request({
    url: '/app-data-search/v3/tran-query',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 *
 * 使用dataReverse
 * V3/V2
 * @param params
 */
function dataReverse(params) {
  return request({
    url: '/app-data-search/v3/reverse',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      transactionNo: params.transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
      reference: params.reference,          //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 交易列表
 * 使用 trans-list() API 可以获得一段时间内的全部订单信息
 * @param params
 */
function transList(params) {
  return request({
    url: '/app-data-search/v3/trans-list',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      startDate: params.startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
      endDate: params.endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 结算列表
 * 使用 settle-list() API 可以获得一段时间内的结算信息
 * @param params
 */
function settleList(params) {
  return request({
    url: '/app-data-search/v3/settle-list',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      startDate: params.startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
      endDate: params.endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 提现列表
 * 使用 withdrawal-list() API 可以获得一段时间内的提现数据
 * @param params
 */
function withdrawalList(params) {
  return request({
    url: '/app-data-search/v3/withdrawal-list',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      startDate: params.startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
      endDate: params.endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 数据状态
 * 使用data-status() API 查询某一天订单的结算状态
 * @param params
 */
function dataStatus(params) {
  return request({
    url: '/app-data-search/v3/data-status',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      // storeNo: params.storeNo,              //required  string	店铺号
      storeAdminNo: params.storeAdminNo,    //optional  string	店员号
      paymentDate: params.paymentDate,      //required  string	支付日期  Format : "YYYYMMDD".
      // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
    }
  }).then(res => {
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}



/**
 * 接口
 * 使用apply-token() API
 * V3
 * @param params
 */
function autoDebitApplyToken(params) {
  return request({
    url: '/auto-debit/v3/apply-token',
    method: 'post',
    data: {
      // merchantNo: params.merchantNo,        //required  string	商户号
      autoDebitNo: params.autoDebitNo,      //	String   The auto debit record ID
      grantType: params.grantType,          //	String    Possible value are 'AUTHORIZATION_CODE', 'REFRESH_TOKEN'
    }
  }).then(res => {
    // console.log('success', res)
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    // console.log('error', res)
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 接口
 * 使用Consult() API
 * V3
 * @param params
 */
function autoDebitConsult(params) {
  return request({
    url: '/auto-debit/v3/consult',
    method: 'post',
    data: {
      note: params.note,                //	String    The payment note
      osType: params.osType,            //	String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS", "ANDROID"
      osVersion: params.osVersion,      //	String    When terminal is WAP or APP, we need this parameter
      autoIpnUrl: params.autoIpnUrl,    //	String    Asynchronous callback address
      autoRedirectUrl: params.autoRedirectUrl,    //	String  Synchronize the callback address
      autoReference: params.autoReference,        //	String    The Invoice Number of the auto-debit in the merchant’s system
      terminal: params.terminal,        //	String    The possible values are: "ONLINE", "WAP", "APP"
      vendor: params.vendor
    }
  }).then(res => {
    // console.log('success', res)
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    // console.log('error', res)
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 接口
 * 使用pay() API
 * V3
 * @param params
 */
function autoDebitPay(params) {
  return request({
    url: '/auto-debit/v3/pay',
    method: 'post',
    data: {
      autoDebitNo: params.autoDebitNo,        //	String  The auto debit record ID
      amount: params.amount,                  //	String  The price amount
      currency: params.currency,              //	String  The price currency; USD,CNY,PHP,IDR,KRW,HKD
      settleCurrency: params.settleCurrency,  //	String  The settlement currency
      reference: params.reference,            //	String  The Invoice Number of the transaction in the merchant’s system
      ipnUrl: params.ipnUrl,                  //	String  Asynchronous callback address
    }
  }).then(res => {
    // console.log('success', res)
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    // console.log('error', res)
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}

/**
 * 接口
 * 使用revoke() API
 * V3
 * @param params
 */
function autoDebitRevoke(params) {
  return request({
    url: '/auto-debit/v3/revoke',
    method: 'post',
    data: {
      autoDebitNo: params.autoDebitNo,        //	String  The auto debit record ID
    }
  }).then(res => {
    // console.log('success', res)
    typeof params.success === 'function' && params.success(res)
    return res
  }).catch(res => {
    // console.log('error', res)
    typeof params.error === 'function' && params.error(res)
    return Promise.reject(res)
  })
}


// export default {
//   securePay,
//   updateRecurring,
//   add,
//   pay,
//   createTransQrcode,
//   reverse,
//   authCapture,
//   authUnfreeze,
//   cashierAdd,
//   prepay,
//   expressPay,
//   refund,
//   tranQuery,
//   dataReverse,
//   transList,
//   settleList,
//   withdrawalList,
//   dataStatus
// }


export default {
  securePay,
  updateRecurring,
  add,
  pay,
  createTransQrcode,
  cashierAdd,
  prepay,
  expressPay,
  refund,
  tranQuery,
  dataReverse,
  authCapture,
  authDetailQuery,
  authFreeze,
  authUnfreeze,
  voucherCreate,
  autoDebitApplyToken,
  autoDebitConsult,
  autoDebitPay,
  autoDebitRevoke
}
