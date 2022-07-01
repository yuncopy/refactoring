
// 账单(发票)
const invoice = require('./invoices.json');
/*
{
  "customer":"Bigco",
  "performances":[
    {
      "playID":"hamlet",
      "audience":55
    },
    {
      "playID":"as-like",
      "audience":35
    },
    {
      "playID":"othello",
      "audience":40
    }
  ]
}
 */


// 所有戏剧信息，每个戏剧有(名称及类型)两个字段
const plays = require('./plays.json')
/*
{
  "hamlet":{"name":"Hamlet","type":"tragedy"},
  "as-like":{"name":"Are you like it","type":"comedy"},
  "othello":{"name":"Othello","type":"tragedy"}
}
*/

// 打印账单详情
function  statement(invoice,plays){

    // 总金额
    let totalAmount = 0;

    //总积分
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer} \n`; //结算
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        // 戏剧的具体信息: name 及 type
        const play = plays[perf.playID];
        // 单个戏剧总金额
        let thisAmount = 0;

        // ------------ 根据戏剧不同类型，决定收取多少金额 --------这段代码之后可提取到一个新函数中-------
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                // 悲剧人数 30+, 超出 1000/人
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                // 喜剧人数 20+, 超出 500/人
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                // 喜剧另收 300/人
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        // ---------------------------------------------------------------------------------

        // 添加观众量积分: 人数 30+, 超出 1人/1积分
        volumeCredits += Math.max(perf.audience - 30, 0);
        // 如果戏剧类型是 comedy ，另添 1人/0.2积分
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        // 输出单个戏剧的信息（名称，花费金额，观众人数）
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;

        // 计算总计花费
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


console.log(statement(invoice,plays));
