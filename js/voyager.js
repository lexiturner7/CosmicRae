let vmCost = 1;
let storageCost = 2;
// 1 vm and 1 storage unit
let combinedCost = 2;
let x = 2;
let y = 1;

function calcMinimumExpenditure(vmCost, storageCost, combinedCost, x, y) {
  // Write your code here
  let totalVMCost = vmCost * x;
  let totalStorageCost = storageCost * y;

  console.log(totalVMCost, totalStorageCost);
}

calcMinimumExpenditure();
