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
  const outputQueue = []; // append only
  const operatorStack = []; // top of the stack is the end

  for (const token of tokens) {
    if (Number.isFinite(Number.parseFloat(token))) {
      outputQueue.push(Number.parseFloat(token));
    } else if ("+-*/".indexOf(token) != -1) {
      while (shouldPop(operatorStack, token)) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token == "(") {
      operatorStack.push(token);
    } else if (token == ")") {
      while (operatorStack[operatorStack.length - 1] != "(") {
        if (operatorStack.length == 0) {
          console.log("Mismatched parentheses.");
          return [];
        }
        outputQueue.push(operatorStack.pop());
      }
      if (operatorStack.pop() != "(") {
        console.log("Should not be here. Missing open paren.");
        return [];
      }
    } else {
      console.log("Unknown token.");
      return [];
    }
  }
  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op == "(") {
      console.log("Mismatched parentheses.");
      return [];
    }
    outputQueue.push(op);
  }
  return outputQueue;
}

function evalRPN(operationStack) {
  const numberStack = [];
  for (const token of operationStack) {
    if ("+-*/".indexOf(token) == -1) {
      numberStack.push(token);
    } else {
      const n1 = numberStack.pop();
      const n2 = numberStack.pop();
      if (token == "+") {
        numberStack.push(n2 + n1);
      } else if (token == "-") {
        numberStack.push(n2 - n1);
      } else if (token == "*") {
        numberStack.push(n2 * n1);
      } else if (token == "/") {
        numberStack.push(n2 / n1);
      } else {
        console.log("Unknown operator.");
        return null;
      }
    }
  }
  if (numberStack.length != 1) {
    console.log("Error evaluating RPN.");
    return null;
  }
  return numberStack[0];
}

function calc(inputStr, say) {
  const tokens = tokenize(inputStr);
  const operationStack = shuntingYard(tokens);
  const results = evalRPN(operationStack);
  if (results != null) {
    say(results);
  }
}

calc.tokenizeForTest = tokenize;
calc.shuntingYardForTest = shuntingYard;
calc.evalRPNForTest = evalRPN;
module.exports = calc;
