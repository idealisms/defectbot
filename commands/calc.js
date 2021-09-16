function tokenize(inputStr) {
  // This regex creates tokens out of numbers, open paren, close paren, plus,
  // times, divide, and subtract.
  const results = inputStr.match(/(\d|[.])+|[(]|[)]|[+]|[*]|[\/]|[-]/gm);
  if (results === null) {
    return [];
  }

  return results.filter((token) => {
    if ("()+-*/".indexOf(token) != -1) {
      return true;
    }
    return isFinite(token);
  });
}

function shouldPop(operator_stack, op1) {
  const op2 = operator_stack[operator_stack.length - 1];
  if (!op2 || op2 == "(") {
    return;
  }
}

// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function shuntingYard(tokens) {}

function evalRPN(operationStack) {}

function calc(inputStr, say) {
  const tokens = tokenize(inputStr);
  const operationStack = shuntingYard(tokens);
  const results = evalRPN(operationStack);
  if (results) {
    say(results);
  }
}

calc.tokenizeForTest = tokenize;
calc.shuntingYardForTest = shuntingYard;
calc.evalRPNForTest = evalRPN;
module.exports = calc;
