const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

let expression = ""; // alles, was im Display steht
let lastNumber = null;
let lastOperator = null;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.textContent.trim();

    // Clear
    if (val === "C") {
      expression = "";
      lastNumber = null;
      lastOperator = null;
      display.value = "";
      return;
    }

    // Delete
    if (val === "DEL") {
      expression = expression.slice(0, -1);
      display.value = expression;
      return;
    }

    // = auswerten
    if (val === "=") {
      try {
        display.value = String(eval(expression));
        expression = display.value;
        lastNumber = null;
        lastOperator = null;
      } catch {
        display.value = "Error";
        expression = "";
      }
      return;
    }

    // Operatoren
    if (["+", "-", "×", "÷"].includes(val)) {
      lastNumber = parseFloat(expression);
      lastOperator = val;
      expression += val === "×" ? "*" : val === "÷" ? "/" : val;
      display.value = expression;
      return;
    }

    // Prozent
    if (val === "%") {
      let operatorIndex = Math.max(
        expression.lastIndexOf("+"),
        expression.lastIndexOf("*"),
        expression.lastIndexOf("/"),
        expression.lastIndexOf("-") // Minus wird berücksichtigt, aber wir prüfen Vorzeichen extra
      );

      let numStr;
      if (operatorIndex <= 0) {
        // Keine Operatoren oder Minus am Anfang
        numStr = expression;
      } else {
        numStr = expression.slice(operatorIndex + 1);
      }

      let num = parseFloat(numStr);

      if (!isNaN(num)) {
        // Wenn die Zahl alleine steht (inklusive Anfangsminus)
        if (operatorIndex <= 0) {
          expression = (num / 100).toString();
        } else {
          // Prozent von vorheriger Zahl (lastNumber * num / 100)
          const prevNumberStr = expression.slice(0, operatorIndex);
          const prevNumber = parseFloat(prevNumberStr);
          const percentValue = (prevNumber * num) / 100;
          expression = prevNumberStr + expression[operatorIndex] + percentValue;
        }
        display.value = expression;
      }
      return;
    }

    // normale Zahl
    expression += val === "," ? "." : val;
    display.value = expression;
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      () => console.log("Service Worker registriert!"),
      (err) => console.log("Service Worker Fehler:", err)
    );
  });
}
