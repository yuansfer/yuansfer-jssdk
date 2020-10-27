# SDK列表
    {
        securePay,
        updateRecurring,
        add,
        pay,
        createTransQrcode,
        reverse,
        authCapture,
        authUnfreeze,
        cashierAdd,
        prepay,
        refund,
        tranQuery,
        transList,
        settleList,
        withdrawalList,
        dataStatus
    }

# 引入方式
    <script src="Yuansfer-js-sdk.js"></script>
    <script>
       Yuansfer.securePay(params)
    </script>
     或
    import yuansfer from 'Yuansfer-js-sdk'

# 使用方式 ----import yuansfer from 'Yuansfer-js-sdk'
   ## 使用前要先调用yuansfer.init初始化参数
    yuansfer.init({
        merchantNo: '******',       //必填
        storeNo: '******',          //必填
        token: '**********',        //必填
        isvFlag: 1 || 0,            //必填 1：服务商； 0：普通商户
        merGroupNo: '*******',      //isvFlag = 1为必填
        env: 'test' // 选填 默认 prod-生产，test-测试 
    })

# API列表
   ## 支付SDK,接口成功则返回收银台链接，直接跳转即可
    yuansfer.securePay({
       amount: amount,                //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
       rmbAmount: rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
       currency: currency,            //required  enum	币种 目前仅支持: "USD"
       vendor: vendor,                //required  enum	支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
       ipnUrl: ipnUrl,                //required  string	异步通知url地址
       callbackUrl: callbackUrl,      //required  string	同步回调url地址。同步回调地址支持宏替换规则 xxxcallback_url?trans_no={amount}&amount={amount}, Yuansfer系统会替换{}中的内容.
       terminal: terminal,            //required  enum	客户端类型 包括: "ONLINE", "WAP".
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       description: description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
       note: note,                    //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
       timeout: timeout,              //optional  integer	超时时间 默认120，单位分钟
       goodsInfo: goodsInfo,          //required  string	订单商品信息，使用JSON格式，不支持特殊字符 例如: [{"goods_name":"name1","quantity":"quantity1"},{"goods_name":"name2","quantity":"quantity2"}]
       creditType: creditType,        //optional  string	信用卡支付类型，只有当vendor=creditcard时需要 包括: "normal"（普通支付）, "recurring"（自动扣款）. 默认为 "normal"
       paymentCount: paymentCount,    //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要 0 表示无截止日期
       frequency: frequency,          //optional  integer	自动扣款频率，只有当vendor=creditcard, creditType=recurring时需要 单位'天'
       success: function(res) {      //成功回调     览器不支持promise使用
       },
       error: function(res) {        //失败回调
       }
      }).then(res => {         //成功回调      浏览器支持promise
       
      }).catch(res => {        //失败回调
       
     })

   ## 自动扣款修改接口，修改自动扣款规则
    yuansfer.updateRecurring({
        scheduleNo: scheduleNo,        //required  string	自动扣款规则号
        paymentCount: paymentCount,    //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要新的paymentCount值必须大于当前设置的值，或者设置为0表示无截止日期
        status: status,                //optional  enum	自动扣款状态，暂时只支持'CANCELLED'， 表示终止自动扣款
    })

   ## 新增交易(商户扫码),可以创建一个 商户扫码 订单
    yuansfer.add({
        storeAdminNo: storeAdminNo,    //optional  string	店员号
        amount: amount,                //optional  decimal	金额
        currency: currency,            //required  enum	币种 目前仅支持: "USD"
        reference: reference,          //required  string	商户系统支付流水号，要求唯一
        description: description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
    })

   ## 支付(商户扫码),所创建的订单提交支付
    yuansfer.pay({
        storeAdminNo: storeAdminNo,    //optional  string	店员号
        transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: reference,          //required  string	商户系统支付流水号，要求唯一
        paymentBarcode: paymentBarcode, //required string	顾客支付条形码/二维码内容
        vendor: vendor,                //required  enum	支付渠道  包括: "alipay", "wechatpay","unionpay".
    })
   
   ## 新增交易(用户扫码),创建交易二维码，顾客可以通过扫描交易二维码完成支付
    yuansfer.createTransQrcode({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       amount: amount,                //optional  decimal	金额
       currency: currency,            //required  enum	币种 目前仅支持: "USD"
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       ipnUrl: ipnUrl,                //optional  string	异步通知url地址
       needQrcode: needQrcode,        //optional  string	值为: true 或者 false. 默认为 true.  如果值为 true, Yuansfer系统将会创建二维码图片  如果值为 false, Yuansfer系统将不会创建二维码图片
       timeout: timeout,              //optional  integer	超时时间 默认120，单位分钟
    })

   ## 取消交易
    使用 reverse() API 来取消交易
    如果顾客还没有支付，取消订单后订单变为关闭状态，顾客也将不能继续支付
    如果顾客已经支付完成，取消订单后Yuansfer将原路径退款给顾客
    yuansfer.reverse({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
    })
    
   ## 预付款扣款
    使用 auth-capture() API 来针对预授权订单进行扣款
    yuansfer.authCapture({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       amount: amount,                //required  string	金额
    })
    
   ##  预付款解冻
    使用 auth-unfreeze() API 来针对预授权订单进行解冻
    yuansfer.authUnfreeze({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       unfreezeAmount: unfreezeAmount, //required  string	解冻金额
    })
    
   ##  新增交易(收银机)
    使用 cashier-add() 接口来发送请求到圆支付后台创建订单， 同时唤醒圆支付POS
    yuansfer.cashierAdd({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       amount: amount,                //optional  decimal	订单美金金额
       currency: currency,            //required  enum	币种 目前仅支持: "USD"
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       ipnUrl: ipnUrl,                //optional  string	异步通知url地址
    })
    
   ##  预付款
    使用 prepay() API 获得微信小程序支付能力
    yuansfer.prepay({
       amount: amount,                //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
       rmbAmount: rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
       currency: currency,            //required  enum	币种 目前仅支持: "USD"
       vendor: vendor,                //required  enum	支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
       ipnUrl: ipnUrl,                //required  string	异步通知url地址
       openid: openid,                //optional  string	微信小程序需要用到
       reference: reference,          //required  string	商户系统支付流水号，要求唯一
       terminal: terminal,            //required  enum	客户端类型 "MINIPROGRAM","APP",vendor=alipay时暂时只支持APP
       description: description,      //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
       note: note,                    //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
       timeout: timeout,              //optional  integer	超时时间 默认120，单位分钟
    })
    
   ##  退款接口
    使用refund() API进行在线支付退款
    yuansfer.refund({
       amount: amount,                //optional  decimal	退款美金金额 amount or rmbAmount有且只能存在一个
       rmbAmount: rmbAmount,          //optional  decimal	退款人民币金额 amount or rmbAmount有且只能存在一个
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
       refundReference: refundReference,//optional  string	商户系统退款流水号
    })
    
   ##  订单查询接口
    使用tran-query() API 可以根据商户系统支付流水号查询Yuansfer系统中关联订单的信息
    yuansfer.tranQuery({
       transactionNo: transactionNo,  //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
       reference: reference,          //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
   })
    
   ##  交易列表
    使用 trans-list() API 可以获得一段时间内的全部订单信息
    yuansfer.transList({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       startDate: startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
       endDate: endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
    })
     
   ##  结算列表
    使用 settle-list() API 可以获得一段时间内的结算信息
    yuansfer.settleList({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       startDate: startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
       endDate: endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
    })
    
   ##  提现列表
    使用 withdrawal-list() API 可以获得一段时间内的提现数据
    yuansfer.withdrawalList({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       startDate: startDate,          //required  string	开始时间  格式 : "YYYYMMDD".
       endDate: endDate,              //required  string	结束时间，endDate 不能超过 开始时间15天. 格式 : "YYYYMMDD".
    })
   
   ##  数据状态
    使用data-status() API 查询某一天订单的结算状态
    yuansfer.dataStatus({
       storeAdminNo: storeAdminNo,    //optional  string	店员号
       paymentDate: paymentDate,      //required  string	支付日期  Format : "YYYYMMDD".
    })
