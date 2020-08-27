function countCredits(volumeCredits, perf, play) {
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function countAmount(play, perf) {
    let thisAmount = 0;
    switch (play.type) {
        case 'tragedy':
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case 'comedy':
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function formatResult(amount) {
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
    return format(amount / 100);
}


function generateData(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '';
    let customer = invoice.customer;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = countAmount(play, perf);
        volumeCredits = countCredits(volumeCredits, perf, play);
        result += ` ${play.name}: ${formatResult(thisAmount)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    return {volumeCredits, result, totalAmount, customer};
}


function printHTML(data) {
    let result = `Statement for ${data.customer}\n`;
    result += data.result;
    result += `Amount owed is ${formatResult(data.totalAmount)}\n`;
    result += `You earned ${data.volumeCredits} credits \n`;
    return result;
}

function statement(invoice, plays) {
    let data = generateData(invoice, plays);
    return printHTML(data);
}


module.exports = {
    statement,
};
