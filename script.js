'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movementsCopy = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  movementsCopy.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${move}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNmaes = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};

createUserNmaes(accounts);

const displaybalance = function (acc) {
  acc.balance = acc.movements.reduce((a, move) => a + move, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcBalanceSummary = function (acc) {
  const incomes = acc.movements
    .filter((move) => move > 0)
    .reduce((acc, move) => acc + move);

  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter((move) => move < 0)
    .reduce((acc, move) => acc + move);

  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements
    .filter((move) => move > 0)
    .map((move) => move * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUi = function (acc) {
  setTimeout(function () {
    containerApp.style.opacity = 100;

    // display movements
    displayMovements(acc.movements);

    // display balance
    displaybalance(acc);

    // display summary
    calcBalanceSummary(acc);
  }, 500);
};
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////   LOGIN  /////
let currentaccount;
btnLogin.addEventListener('click', function (e) {
  // prevent the page from reloading
  e.preventDefault();
  containerApp.style.opacity = 0;
  // entering userName

  currentaccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  // entering pin
  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    //display welcome message
    labelWelcome.textContent = `welcome back,${
      currentaccount.owner.split(' ')[0]
    }`;

    updateUi(currentaccount);
  } else {
    labelWelcome.textContent = 'Log in to get started';
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//// TRANSFER /////
btnTransfer.addEventListener('click', function (e) {
  // prevent the page from reloading
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  console.log(amount);
  console.log(recieverAccount);

  if (
    amount > 0 &&
    recieverAccount &&
    currentaccount.balance >= amount &&
    currentaccount.userName !== recieverAccount.userName
  ) {
    currentaccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    updateUi(currentaccount);
    console.log('valid');
  }

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

// requesting loan ////
btnLoan.addEventListener('click', function (e) {
  // prevent the webpage from reloading
  e.preventDefault();

  // store the requested loan
  const requestedLoan = Number(inputLoanAmount.value);

  // stroring the approavl
  const approval = currentaccount.movements.some(
    (move) => move >= 0.1 * requestedLoan
  );
  if (requestedLoan > 0 && approval) {
    currentaccount.movements.push(requestedLoan);
    updateUi(currentaccount);
  }
  // reset the button
  inputLoanAmount.value = '';
});

//// DELETE ACCOUNT ////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentaccount.userName === inputCloseUsername.value &&
    currentaccount.pin === Number(inputClosePin.value)
  ) {
    // you can use anyone of them
    const index = accounts.findIndex(
      (acc) => acc.userName === currentaccount.userName
    );

    // const index2 = accounts.indexOf(currentaccount);

    if (index !== -1) accounts.splice(index, 1);

    // hide the ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT //
let flag = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  flag = !flag;
  displayMovements(currentaccount.movements, !flag);
});

// small challenge i did
// const max = function (movements) {
//   const m = movements.reduce((acc, mov, i) => {
//     if (acc > mov) return acc;
//     else {
//       return mov;
//     }
//   }, movements[0]);

//   const temp = [m];
//   movements.forEach(function (move, i) {
//     if (move !== m) {
//       temp.push(move);
//     }
//   });
//   console.log(temp);

//   account1.movements = temp;
// };

// max(account1.movements);

// coding challenge //
/*

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
ages ('ages'), and does the following things in order:

 // using map method //
1. Calculate the dog age in human years using the following formula: if the dog is 
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4


2. Exclude all dogs that are less than 18 human years old (which is the same as 
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know 
from other challenges how we calculate averages �)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

*/

const calcAverageHumanAge = function (ages) {
  const dogsInHumanYears = ages.map(function (age) {
    if (age <= 2) {
      return age * 2;
    } else {
      return 16 + age * 4;
    }
  });

  console.log(dogsInHumanYears);

  const exclude = dogsInHumanYears.filter(function (age) {
    if (age > 18) {
      return age;
    }
  });

  const average = exclude.reduce(function (acc, age, i) {
    if (i === exclude.length - 1) {
      return (acc + age) / exclude.length;
    } else {
      return acc + age;
    }
  }, 0);

  console.log(`the average = ${average}`);
};

const calcAverageHumanAge2 = function (ages) {
  const average = ages
    .map((age) => (age <= 2 ? age * 2 : age * 4 + 16))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  console.log(`the average = ${average}`);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(accounts);
const account = accounts.find((acc) => acc.owner === 'Jonas Schmedtmann');
console.log(account);

let a;
for (const account of accounts) {
  if (account.owner === 'Steven Thomas Williams') {
    a = account;
    break;
  }
}
const EuroToUsd = 1.1;
const chain = function (movements) {
  const resultInDollars = movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * EuroToUsd)
    .reduce((acc, mov) => acc + mov);
  return Math.trunc(resultInDollars);
};

console.log(chain([100, 100, 100]));
console.log(a);

// something fro remember //
// setTimeout(function () {
//   console.log('ahmad');
//   console.log('ahmad');
//   console.log('ahmad');
// }, 3000);

console.log(movements);
console.log(
  movements.some(function (move) {
    return move > 5000;
  })
);
console.log(
  movements.every(function (move) {
    return move < 5000;
  })
);

console.log(movements.filter((move) => move > 0));

/// flat method
// NOTE : i want to calculate the movements of all accounts

const arr1 = [[1, 2, 3], [[1, 2], 4], 5, 6];
console.log(arr1.length);

// map then flat
const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, move) => acc + move);
console.log(overallBalance);

// because it pretty common to use map then flat , it comes with a new method called flatMap()
const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, move) => acc + move);
console.log(overallBalance2);

// Note that : in flatMap method it works for one level of nesting

// in this case even it empty we can use all the methods that we learned before on it
const one = [1, 2, 3, 4, 5];
console.log(one.map(() => 4));

// in this case we cant use any methods that we learn on it before filling it
const two = new Array(5).fill(1);

console.log(two);
console.log(two.map(() => 5));

// Array.from method

const three = Array.from({ length: 8 }, () => 7);
console.log(three);
console.log(three.map((_, i) => i + 1));

const dice = Array.from({ length: 15 }, function () {
  return Math.trunc(Math.random() * 6 + 1);
});

console.log(dice);

labelBalance.addEventListener('click', function () {
  const sum = Array.from(document.querySelectorAll('.movements__value'), (el) =>
    Number(el.textContent.replace('€', ''))
  ).reduce((acc, curr) => acc + curr);

  console.log(sum);
});
