import md5 from 'js-md5'

//计算数字签名
export function calculateVerifySign(contents) {
  //1.对参数进行排序，然后用a=1&b=2..的形式拼接
  let sortArray = []

  Object.keys(contents).sort().forEach(k => {
    contents[k] && sortArray.push(`${k}=${contents[k]}`)
  })

  //对token进行md5，得到的结果追加到sortArray之后
  sortArray.push(md5('5cbfb079f15b150122261c8537086d77a'))

  const tempStr = sortArray.join('&')
  console.log('tempStr:', tempStr);

  //对tempStr 再进行一次md5加密得到verifySign
  const verifySign = md5(tempStr)
  console.log('veirfySign:', verifySign)

  return verifySign;
}
