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
    let result = [];
    let customer = invoice.customer;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = countAmount(play, perf);
        volumeCredits = countCredits(volumeCredits, perf, play);
        result.push({name: play.name, amount: formatResult(thisAmount), audience: perf.audience})
        // result += ` ${play.name}: ${formatResult(thisAmount)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    return {volumeCredits, result, totalAmount, customer};
}


function printTXT(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let d of data.result) {
        result += ` ${d.name}: ${d.amount} (${d.audience} seats)\n`;
    }
    result += `Amount owed is ${formatResult(data.totalAmount)}\n`;
    result += `You earned ${data.volumeCredits} credits \n`;
    return result;
}

function printHTML(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n` +
        '<table>\n' +
        '<tr><th>play</th><th>seats</th><th>cost</th></tr>';

    for(let d of data.result){
        result += ` <tr><td>${d.name}</td><td>${d.audience}</td><td>${d.amount}</td></tr>\n`
    }
     result += '</table>\n' +
        `<p>Amount owed is <em>${formatResult(data.totalAmount)}</em></p>\n` +
        `<p>You earned <em>${data.volumeCredits}</em> credits</p>\n`;
    return result;
}

function statement(invoice, plays) {
    let data = generateData(invoice, plays);
    return printTXT(data);
}

function htmlStatement(invoice, plays) {
    let data = generateData(invoice, plays);
    return printHTML(data);
}

module.exports = {
    statement,
    htmlStatement,
};
