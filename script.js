const display = document.querySelector(".display");
const historyList = document.querySelector(".history-list");
const buttons = document.querySelectorAll("button");
const discountInput = document.getElementById("discount-input");
const applyDiscountBtn = document.getElementById("apply-discount-btn");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

let history = [];

const updateDisplay = () => {
  display.focus();
  display.value = output;
  console.log(output);
  console.log(display.value);
};

const updateHistory = () => {
  historyList.innerHTML = "";
  history.forEach((calculation) => {
    const li = document.createElement("li");
    li.textContent = calculation;
    historyList.appendChild(li);
  });
};

const applyDiscount = () => {
  const discountValue = parseFloat(discountInput.value);
  if (!isNaN(discountValue)) {
    let res = eval(output.replace("%", "/100"))
    const discountedOutput = res * ((100 - discountValue) / 100);
    strVersion = String(discountedOutput);
    output = strVersion;
    updateDisplay();
  }
};

function deleteHistory() {
  historyList.innerHTML = ""
  history = []
  localStorage.removeItem("calculationHistory")
}


const addToHistory = () => {
  history.push(`${output} = ${eval(output.replace("%", "/100"))}`);
  updateHistory();
  saveHistoryToLocalStorage(); // Save history to localStorage after updating
};

const applyHistoryItem = (item) => {
  output = item.split(" = ")[0];
  updateDisplay();
};

//Define function to calculate based on button clicked.
const calculate = (btnValue) => {
  display.focus();
  if (btnValue === "=" && output !== "") {
    //If output has '%', replace with '/100' before evaluating.
    addToHistory();
    output = eval(output.replace("%", "/100"));
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    //If DEL button is clicked, remove the last character from the output.
    output = output.toString().slice(0, -1);
  } else {
    //If output is empty and button is specialChars then return
    if (output === "" && specialChars.includes(btnValue)) return;
    output += btnValue;
  }
  console.log(output);
  display.value = output;
};

historyList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    applyHistoryItem(e.target.textContent);
  }
});

const saveHistoryToLocalStorage = () => {
  localStorage.setItem("calculationHistory", JSON.stringify(history));
};

// Load history from localStorage when the page loads
const loadHistoryFromLocalStorage = () => {
  const savedHistory = localStorage.getItem("calculationHistory");
  if (savedHistory) {
    history = JSON.parse(savedHistory);
    updateHistory();
  }
};

// Call the function to load history from localStorage when the page loads
loadHistoryFromLocalStorage();

applyDiscountBtn.addEventListener("click", applyDiscount);

//Add event listener to buttons, call calculate() on click.
buttons.forEach((button) => {
  //Button click listener calls calculate() with dataset value as argument.
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});



let const_array = [];
const add = document.getElementById("const-button");
const key = document.querySelector(".name");
const value = document.querySelector(".amount");
const list = document.querySelector(".constant_list");
const storage = JSON.parse(localStorage.getItem("constants"));

if (storage) {
  const_array = storage;

  for (let i = 0; i < storage.length; i++) {
    const element = storage[i];
    list.insertAdjacentHTML("afterbegin",
      `
      <div class="constant" id="${element?.id}" amount="${element.value}">${element.key}
        <div class="del_btn">
          <div>
            <img src="./icons/cap.png" class="cap gray">
            <img src="./icons/bin.png" class="bin gray">
          </div>
          
          <div>
            <img src="./icons/cap-red.png" class="cap red">
            <img src="./icons/bin-red.png" class="bin red">
          </div>
        </div>
      </div>
    `);
    delConstant(document.getElementById(element?.id).firstElementChild);
  }
  constCalc();

}

add.onclick = () => {
  if (!(key.value && value.value)) {
    return alert("Enter values");
  }
  const guid = uuidv4();
  list.insertAdjacentHTML("afterbegin",
    `
    <div class="constant" id="${guid}" amount="${value.value}">${key.value}
    <div class="del_btn">
        <div>
          <img src="./icons/cap.png" class="cap gray">
          <img src="./icons/bin.png" class="bin gray">
        </div>
        
        <div>
          <img src="./icons/cap-red.png" class="cap red">
          <img src="./icons/bin-red.png" class="bin red">
        </div>
      </div>
    </div>

  </div>

  `)
  constCalc()
  const_array.push({ id: guid, key: key.value, value: value.value });
  localStorage.setItem("constants", JSON.stringify(const_array));
  delConstant(document.getElementById(guid).firstElementChild);

  key.value = "";
  value.value = "";

}

function constCalc() {
  const consts = document.querySelectorAll(".constant");
  for (let i = 0; i < consts.length; i++) {
    const cons = consts[i];
    cons.onclick = () => {
      const amount = cons.getAttribute("amount");
      calculate(amount);
    }
  }
}


function delConstant(button) {
  console.log(button);
  const constant = button.parentElement;
  const storage = JSON.parse(localStorage.getItem("constants"));
  button.onclick = () => {

    for (let i = 0; i < storage.length; i++) {
      const element = storage[i];
      console.log(storage);
      if (element.id == constant?.id) {
        storage.splice(i, 1);
        localStorage.setItem("constants", JSON.stringify(storage));
      } 
    }

    constant.remove();
  }
}


function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

