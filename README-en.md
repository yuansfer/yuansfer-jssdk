
English | [简体中文](./README.md)

# SDK Method Lists
    {
        securePay,
        updateRecurring,
        add,
        pay,
        createTransQrcode,
        reverse,
        cashierAdd,
        prepay,
        braintreePayments,
        expressPay,
        refund,
        tranQuery,
        dataReverse,
        voucherCreate,
        authCapture,
        authDetailQuery,
        authFreeze,
        authUnfreeze,
        autoDebitApplyToken,
        autoDebitConsult,
        autoDebitPay,
        autoDebitRevoke
    }

# Import
    <script src="Yuansfer-js-sdk.js"></script>
    <script>
       Yuansfer.securePay(params)
    </script>
     Or
    import yuansfer from 'Yuansfer-js-sdk'

# Instruction ----import yuansfer from 'Yuansfer-js-sdk'
   ## Call yuansfer.init to initialize parameters before use
    yuansfer.init({
        merchantNo: '******',       //Required
        storeNo: '******',          //Required
        token: '**********',        //Required
        isvFlag: 1 || 0,            //Required 1：Service provider； 0：Merchant
        merGroupNo: '*******',      //If isvFlag = 1, it is required
        env: 'test' // Optional, Possible value: prod or test 
    })

# API Lists
   ## SecurePay SDK, redirect to Yuansfer cashier page if request success
    yuansfer.securePay({
       amount: amount,      //	String  The price amount
       currency: currency,  //	String  The price currency, possible values: USD,CNY
       settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
       vendor: vendor,                //required  enum	Payment channel include: "alipay", "wechatpay", "unionpay", "creditcard".
       ipnUrl: ipnUrl,                //required  string	Asynchronous notification url address
       callbackUrl: callbackUrl,      //required  string	Synchronous callback url address。Synchronous callback address supports                                                           macro replacement rules xxxcallback_url?trans_no={amount}&amount=                                                               {amount}, Yuansfer will replace{} content.
       terminal: terminal,            //required  enum	Client type include: "ONLINE", "WAP".
       reference: reference,          //required  string	Merchant system payment reference number, unique
       description: description,      //optional  string	Order description，The information will be displayed at the                                                                       casher page, special characters are not supported
       note: note,                    //optional  string	Order notes，The info will be returned to the merchant system as                                                                 it is when the callback is made, and special characters are not                                                                 supported
       osType: osType,                //String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS",                                               "ANDROID"
       timeout: timeout,              //optional  integer	The timeout time, 120 by default, in minutes
       goodsInfo: goodsInfo,          //required  string	Order goods，JSON format，special characters are not supported, such as:                                                         [{"goods_name":"name1","quantity":"quantity1"},                                                                                 {"goods_name":"name2","quantity":"quantity2"}]            
       creditType: creditType,        //optional  string	Credit card payment type，required when vendor=creditcard include:                                                               "normal", "recurring". default "normal"
       paymentCount: paymentCount,    //optional  integer	Auto-Debit ，required when vendor=creditcard, creditType=recurring, 0: no                                                         limit
       frequency: frequency,          //optional  integer	Auto-Debit frequency，required when vendor=creditcard, creditType =                                                               recurring, unit 'day'
       success: function(res) {      //Success callback     Use when broswer does not support promise
       },
       error: function(res) {        //Failure callback
       }
      }).then(res => {         //Success callback      Browser support promise
       
      }).catch(res => {        //Failure callback
       
     })

   ## Auto-Debit modification API, modify Auto-Debit schedules
    yuansfer.updateRecurring({
        scheduleNo: scheduleNo,        //required  string	Auto-Debit schedule number
        paymentCount: paymentCount,    //optional  integer	Auto-Debit count，required when vendor = creditcard, creditType=                                                                 recurring,new paymentCountmust be larger than current value，or set to 0                                                         to not limit the count
        status: status,                //optional  enum	Auto-Debit status，currently only support'CANCELLED': stop the Auto-Debit
    })

   ## New transaction(Merchant Scan QR Code), create a order for merchant to scan
    yuansfer.add({
        storeAdminNo: storeAdminNo,    //optional  string	Store Admin Number
        amount: amount,      //	String  The price amount
        currency: currency,  //	String  The price currency, possible values: USD,CNY
        settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
        reference: reference,          //required  string	Merchant System order ID，Unique
        description: description,      //optional  string	Order description，The information will be displayed at the                                                                       casher page, special characters are not supported
        preAuth: preAuth,              //optional  string	Prepay flag, true:prepay order，false:normal order,default false
    })

   ## Pay(Merchant Scan QR Code), the created order is submitted for payment
    yuansfer.pay({
        storeAdminNo: storeAdminNo,    //optional  string	Store Admin Number
        transactionNo: transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
        reference: reference,          //required  string	Merchant System order ID，Unique
        paymentBarcode: paymentBarcode, //required string	Customer barcode / QR code content
        vendor: vendor,                //required  enum	Payment channel  include: "alipay", "wechatpay","unionpay".
    })

   ## New transaction(User Scan QR Code), Create a transaction QR code, customers can complete the payment by scanning the transaction QR code
    yuansfer.createTransQrcode({
       storeAdminNo: storeAdminNo,    //optional  string	Store Admin Number
       amount: amount,      //	String  The price amount
       currency: currency,  //	String  The price currency, possible values: USD,CNY
       settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
       reference: reference,          //required  string	Yuansfer system order ID, either transactionNo or reference is required
       ipnUrl: ipnUrl,                //optional  string	Asynchronous notification url address
       needQrcode: needQrcode,        //optional  string	true or false. default true.  if value is true, Yuansfer system will                                                             generate a QR Code
       preAuth: preAuth,              //optional  string	Prepay flag, true:prepay order，false:normal order,default false
       timeout: timeout,              //optional  integer	The timeout time, 120 by default, in minutes
    })

   ##  * Void Transaction
       * Use reverse() API to void transaction
       * If customers havent paid the transaction，Transaction will be closed，customers no longer be able to make a payment
       * If customer paid the transaction，Yuansfer will refund the payment 
      yuansfer.reverse({
        storeAdminNo: params.storeAdminNo,    //optional  string	Store Admin Number
        transactionNo: params.transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
        reference: params.reference,          //required  string	Merchant System order ID，Unique
      })
​    
   ##  New transaction(POS)
    Use cashier-add() API to send request to Yuansfer System in order to create order, on the same time it will wake up Yuansfer POS 
    yuansfer.cashierAdd({
       storeAdminNo: storeAdminNo,    //optional  string	Store Admin Number
       amount: amount,      //	String  The price amount
       currency: currency,  //	String  The price currency, possible values: USD,CNY
       settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
       transactionNo: transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
       reference: reference,          //required  string	Merchant System order ID，Unique
       ipnUrl: ipnUrl,                //optional  string	Asynchronous notification url address
    })

   ##  Prepay
    Use prepay() API to pay with WeChat-Mini Program
    yuansfer.prepay({
       amount: amount,      //	String  The price amount
       currency: currency,  //	String  The price currency, possible values: USD,CNY
       settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
       vendor: vendor,                //required  enum	Payment channel include: "alipay", "wechatpay", "unionpay", "creditcard".
       ipnUrl: ipnUrl,                //required  string	Asynchronous notification url address
       openid: openid,                //optional  string	Required for WeChat-Mini Program
       reference: reference,          //required  string	Merchant System order ID，Unique
       terminal: terminal,            //required  enum	Client type "MINIPROGRAM","APP",when vendor=alipay, only support APP
       description: description,      //optional  string	Order description，The information will be displayed at the                                                                       casher page, special characters are not supported
       note: note,                    //optional  string	Order notes，The info will be returned to the merchant system as                                                                 it is when the callback is made, and special characters are not                                                                 supported
       timeout: timeout,              //optional  integer	The timeout time, 120 by default, in minutes
    })

   ## Braintree Pay
    
    yuansfer.braintreePayments({
        paymentMethodNonce: params.paymentMethodNonce,    //required
        paymentMethod: params.paymentMethod,            //required    |Credit Card|credit_card||PayPal|paypal_account||Venmo|venmo_account||Google Pay|android_pay_card||Apple Pay|apple_pay_card|
        transactionNo: params.transactionNo,      //	String
    })

   ## Union Pay prepay
    yuansfer.expressPay({
        amount: amount,      //	String  The price amount
        currency: currency,  //	String  The price currency, possible values: USD,CNY
        settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
        cardNumber: cardNumber,    //	String  Card number
        cardExpYear: cardExpYear,    //	String    Expiration year of the Card.
        cardExpMonth: cardExpMonth,    //	String    Expiration month of the Card.
        cardCvv: cardCvv,    //	String    Card CVV.
        reference: reference,    //	Stirng    The Invoice Number of the transaction in the merchant’s system.
        clientIp: clientIp,
    })

   ##  Refund API
    Use refund() API to refund transactions
    yuansfer.refund({
       amount: amount,      //	String  The price amount
       currency: currency,  //	String  The price currency, possible values: USD,CNY
       settleCurrency: settleCurrency,    //	String  The settlement currency, possible values:USD
       transactionNo: transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
       reference: reference,          //optional  string	Merchant System order ID, either transactionNo or reference is required
       refundReference: refundReference,//optional  string	Merchant system refund reference number
    })

   ##  Search Transaction API
    Use tran-query() API: You can search the related order information in the Yuansfer system according to the merchant system payment reference number
    yuansfer.tranQuery({
       transactionNo: transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
       reference: reference,          //optional  string	Merchant System order ID, either transactionNo or reference is required
   })

   ##  Use dataReverse
    yuansfer.dataReverse({
       transactionNo: transactionNo,  //optional  string	Yuansfer system order ID, either transactionNo or reference is required
       reference: reference,          //optional  string	Merchant System order ID, either transactionNo or reference is required
    })

   ## Use auth-capture
    yuansfer.authCapture({
      outAuthInfoNo: outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: outAuthDetailNo,  //	String  merchant system's authorization operation ID
      reference: reference,              //	String  The Invoice Number of the transaction in the merchant’s system
      amount: amount,                    //	Number    The amount to capture.
      currency: currency,                //	String    The price currency, possible values are 'USD'
      ipnUrl: ipnUrl,                    //	String    Asynchronous callback address
    })

   ## Use auth-detail-query
    yuansfer.authDetailQuery({
      outAuthInfoNo: outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: outAuthDetailNo,  //	String  merchant system's authorization operation ID
    }

   ## Use auth-freeze
    yuansfer.authFreeze({
      outAuthInfoNo: outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: outAuthDetailNo,  //	String  merchant system's authorization operation ID
      amount: amount,                    //	Number    The amount to capture.
      currency: currency,                //	String    The price currency, possible values are 'USD'
      authIpnUrl: authIpnUrl,                //	String    Asynchronous callback address
      vendor: vendor,                    //	String    Possible values are 'alipay'
      paymentBarcode: paymentBarcode     //	String    The payment barcode from the customer.
    })

   ## Use auth-unfreeze
    yuansfer.authUnfreeze({
      outAuthInfoNo: outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: outAuthDetailNo,  //	String  merchant system's authorization operation ID
      unfreezeAmount: unfreezeAmount,                    //	Number    The amount to capture.
      currency: currency,                //	String    The price currency, possible values are 'USD'
      authIpnUrl: authIpnUrl                //	String    Asynchronous callback address
    })

   ## Use voucher-create
    yuansfer.voucherCreate({
      outAuthInfoNo: outAuthInfoNo,      //	String  merchant system's authorization ID
      outAuthDetailNo: outAuthDetailNo,  //	String  merchant system's authorization operation ID
      amount: amount,                    //	Number    The amount to capture.
      currency: currency,                //	String    The price currency, possible values are 'USD'
      authIpnUrl: ipnUrl,                //	String    Asynchronous callback address
      vendor: vendor,                    //	String    Possible values are 'alipay'
    })

   ## Use /auto-debit/v3/apply-token
      yuansfer.autoDebitApplyToken({
        autoDebitNo: params.autoDebitNo,      //	String   The auto debit record ID
        grantType: params.grantType,          //	String    Possible value are 'AUTHORIZATION_CODE', 'REFRESH_TOKEN'
      })
      
      
   ## Use /auto-debit/v3/consult
      yuansfer.autoDebitConsult({
        osType: params.osType,            //	String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS", "ANDROID"
        osVersion: params.osVersion,      //	String    When terminal is WAP or APP, we need this parameter
        autoIpnUrl: params.autoIpnUrl,    //	String    Asynchronous callback address
        autoRedirectUrl: params.autoRedirectUrl,    //	String  Synchronize the callback address
        autoReference: params.autoReference,        //	String    The Invoice Number of the auto-debit in the merchant’s system
        terminal: params.terminal,        //	String    The possible values are: "ONLINE", "WAP", "APP"
        vendor: params.vendor,
        note: params.note,                //	String    The payment note
      })
          
   ## Use /auto-debit/v3/pay
       yuansfer.autoDebitPay({
         autoDebitNo: params.autoDebitNo,        //	String  The auto debit record ID
         amount: params.amount,                  //	String  The price amount
         currency: params.currency,              //	String  The price currency; USD,CNY,PHP,IDR,KRW,HKD
         settleCurrency: params.settleCurrency,  //	String  The settlement currency
         reference: params.reference,            //	String  The Invoice Number of the transaction in the merchant’s system
         ipnUrl: params.ipnUrl,                  //	String  Asynchronous callback address
       })
              
              
   ## Use /auto-debit/v3/revoke
       yuansfer.autoDebitRevoke({
         autoDebitNo: params.autoDebitNo,        //	String  The auto debit record ID
       })
