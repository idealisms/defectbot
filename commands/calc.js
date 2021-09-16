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
  const precedence = {
    "+": 2,
    "-": 2,
    "*": 3,
    "/": 3,
  };
  const op2 = operator_stack[operator_stack.length - 1];
  if (!op2 || op2 == "(") {
    return false;
  }
  return (
    precedence[op2] > precedence[op1] || precedence[op2] == precedence[op1]
  );
}

// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function shuntingYard(tokens) {
  const output_queue = []; // append only
  const operator_stack = []; // top of the stack is the end

  for (const token of tokens) {
    if (Number.isFinite(Number.parseFloat(token))) {
      output_queue.push(Number.parseFloat(token));
    } else if ("+-*/".indexOf(token) != -1) {
      while (shouldPop(operator_stack, token)) {
        output_queue.push(operator_stack.pop());
      }
      operator_stack.push(token);
    } else if (token == "(") {
      operator_stack.push(token);
    } else if (token == ")") {
      while (operator_stack[operator_stack.length - 1] != "(") {
        if (operator_stack.length == 0) {
          console.log("Mismatched parentheses.");
          return [];
        }
        output_queue.push(operator_stack.pop());
      }
      if (operator_stack.pop() != "(") {
        console.log("Should not be here. Missing open paren.");
        return [];
      }
    } else {
      console.log("Unknown token.");
      return [];
    }
  }
  while (operator_stack.length > 0) {
    const op = operator_stack.pop();
    if (op == "(") {
      console.log("Mismatched parentheses.");
      return [];
    }
    output_queue.push(op);
  }
  return output_queue;
}

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
