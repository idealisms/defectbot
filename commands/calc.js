function tokenize(inputStr) {
    // This regex creates tokens out of numbers, open paren, close paren, plus,
    // times, divide, and subtract.
    const results = inputStr.match(/(\d|[.])+|[(]|[)]|[+]|[*]|[\/]|[-]/gm);
    if (results === null) {
        return [];
    }

    return results.filter((token) => {
        if ('()+-*/'.indexOf(token) != -1) {
            return true;
        }
        return isFinite(token);
    });
}

function shuntingYard(tokens) {

}

function evalRPN(operationStack) {

}

function calc(inputStr, say) {
    const tokens = tokenize(inputStr);
    const operationStack = shuntingYard(tokens);
    const results = evalRPN(operationStack);
    if (results) {
        say(results);
    }
}

function doCalc(channel) {
    const tokens = /(\d|[.])+|[(]|[)]|[+]|[*]|[\/]|[-]/gm;
    // Shunting-yard https://en.wikipedia.org/wiki/Shunting-yard_algorithm
    const output_queue = [];  // append only
    const operator_stack = [];  // top of the stack is the end
    for (const token of tokens) {
      if (Number.isFinite(Number.parseFloat(token))) {
        
      }
    }
  
    // RPN eval
  }
  

calc.tokenizeForTest = tokenize;
calc.shuntingYardForTest = shuntingYard;
calc.evalRPNForTest = evalRPN;
module.exports = calc;
