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
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
         <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         <div class="movements__value">${mov}€</div>
     </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(filteredInterest => filteredInterest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserNames(accounts);
let currentAccount;
// console.log(accounts);
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('logged in');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    recieverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
  }
  updateUI(currentAccount);
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => (age > 2 ? 16 + age * 4 : age * 2));
//   const filteredAge = humanAge.filter(age => age >= 18);
//   const number = filteredAge.length;
//   const average = filteredAge.reduce(
//     (answer, curr, i, arr) => answer + curr / arr.length,
//     0
//   );
//   console.log(humanAge);
//   console.log(filteredAge);
//   console.log(average);
// };
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age > 2 ? 16 + age * 4 : age * 2))
//     .filter(age => age >= 18)
//     .reduce((answer, curr, i, arr) => answer + curr / arr.length, 0);
// console.log(calcAverageHumanAge([2, 2, 1, 4, 5]));
// const checkDogs = function (arr1, arr2) {
//   const correctedJulia = arr1.slice();
//   correctedJulia.splice(0, 1);
//   correctedJulia.splice(-2);
//   // console.log(correctedJulia);
//   const arrEdit = correctedJulia.concat(dogsKate);
//   console.log(arrEdit);
//   arrEdit.forEach(function (julias, i) {
//     const result = julias >= 3 ? 'adult' : 'puppy';
//     console.log(
//       `Dog number ${i + 1} is a ${result} and is ${julias} years old`
//     );
//   });
// };
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 3, 1, 4];
// checkDogs(dogsJulia, dogsKate);

// const euroToUsd = 1.1;
// const movementInEuro = movements.map(mov => mov * euroToUsd);
// console.log(movementInEuro);
// const movementDescription = movements.map(
//   (mov, i) =>
//     `your have successfully ${mov > 0 ? 'depoited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementDescription);

// const creatUserNames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.userName = acc.owner
//       .toLocaleLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// creatUserNames(accounts);
// console.log(accounts);

// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);
// console.log(movements);
// const reduced = movements.reduce(
//   (acc, cur, i, arr) =>
//     // let sum = 0;
//     acc + cur,
//   0
// );
// console.log(reduced);
// // const ermias = [12, 52, 152, 546, 857, 1354, 852, 4565, 12];
// for (const [i, ermi] of ermias.entries()) {
//   console.log(i + 1, ermi);
// }
// console.log('__________-----------break-------------_______________');
// ermias.forEach(function (ermi, i) {
//   console.log(i + 1, ermi);
// });
// const displayMovements = function (movements) {
//   containerMovements.innerHTML = '';
//   movements.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const html = `<div class="movements__row">
//     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>

//     <div class="movements__value">${mov}</div>
//   </div>`;
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// displayMovements(account2.movements);
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) console.log(`${i + 1} your deposite: ${movement}`);
//   else {
//     console.log(` ${i + 1} your withdrawal amount is ${movement}`);
//   }
// }
// movements.forEach(function (movement, i) {
//   if (movement > 0) console.log(`${i + 1} your deposite: ${movement}`);
//   else {
//     console.log(` ${i + 1} your withdrawal amount is ${movement}`);
//   }
// });
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// accounts.forEach(function (acc) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// });
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);
// console.log(accountMovements);
// const AllMovements = accountMovements.;
// console.log(AllMovements);
// const totalBalance = AllMovements.reduce((acc, cur) => acc + cur, 0);
// console.log(totalBalance);
const die = Array.from(
  { length: 100 },
  (_, i) => Math.trunc(100 * Math.random(i)) + 1
);
console.log(die);
labelBalance.addEventListener('click', function (e) {
  e.preventDefault();
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    i => Number(i.textContent.replace('€', ''))
  );
  console.log(movementUI);
});
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      sum[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      // cur > 0
      //   ? (sum.deposits = sum.deposits + cur)
      //   : (sum.withdrawals = sum.withdrawals + cur);

      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
// console.log(deposits, withdrawals);
// const capitalizeWord = function (title) {
//   const cap = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'but', 'or', 'in', 'with', 'on'];
//   const capitalized = title
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : cap(word)))
//     .join(' ');
//   return cap(capitalized);
// };
// console.log(capitalizeWord('ermias is a boy'));
const dogs = [
  { weight: 22, curFood: 250, owners: ['alice', 'bob'] },
  { weight: 8, curFood: 200, owners: ['matilda'] },
  { weight: 13, curFood: 275, owners: ['sarah', 'john'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
dogs.forEach(function (dog) {
  dog['recommendedFood'] = Math.trunc(dog['weight'] ** 0.75 * 28);
});
// console.log(dogs);
// dogs.forEach(function (dog) {
//   dog.owners.filter(dog => dog.owners.every(owners => (owners = 'sarah')));
// });
// dogs.owners.filter(owners.includes('sarah'));
// console.log(dogs.flat(dogs.owners));
// const x = dogs.forEach(function (dog) {
//   return dog.owners.includes('sarah');
// });
// console.log(x);
// const ownersEatTooMuch = dogs.filter()
// conat ownersEatTooLittle =

// const withdrawal = movements.filter(mov => mov < 0);
const sarahDog = dogs.find(dog => dog.owners.includes('sarah'));
console.log(sarahDog);
// sarahDog;
console.log(
  `they are eating too ${
    sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'
  } food`
);
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownersEatTooLittle);
console.log(` ${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
console.log(` ${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// console.log(dogs);
const checkOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(checkOkay));
console.log(dogs.filter(checkOkay));
// console.log(okayDogs);
// const copyDog = [...dogs];
const copyDog = dogs
  .slice()
  .sort((dog1, dog2) => dog1.recommendedFood - dog2.recommendedFood);
console.log(copyDog);
// console.log(copyDog2);
console.log(dogs);
