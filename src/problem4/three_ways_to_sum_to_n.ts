/**
 * This function use the Sum of Integers Formula calculate the sum of numbers from 1 to n
 * with complexity O(1)
 * @param n number
 * @returns number
 */
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * This function use recursion to calculate the sum of numbers from 1 to n
 * with complexity O(n), This function spend more memory than sum_to_n_c
 * @param n number
 * @returns number
 */
function sum_to_n_b(n: number): number {
  if (n < 0) return 0;

  return n + sum_to_n_b(n - 1);
}

/**
 * This function use loop to calculate the sum of numbers from 1 to n
 * with complexity O(n)
 * @param n number
 * @returns number
 */
function sum_to_n_c(n: number): number {
  let sum: number = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
