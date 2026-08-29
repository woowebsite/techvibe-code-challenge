/**
 * Problem 1: Three unique implementations of sum_to_n
 * Input: n - any integer
 * Output: summation from 1 to n (e.g. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15)
 */

/**
 * Implementation A: Mathematical Closed-Form Formula (Gauss Summation)
 * 
 */
var sum_to_n_a = function (n) {
    return n > 0 ? (n * (n + 1)) * 0.5 : 0;
};

/**
 * Implementation B: Tight Decrementing Loop (Inlined Body / Zero-Check)
 * 
 */
var sum_to_n_b = function (n) {
    let sum = 0;
    for (; n > 0; sum += n--);
    return sum;
};

/**
 * Implementation C: Loop Unrolling (4x) with Bitwise Remainder
 * 
 */
var sum_to_n_c = function (n) {
    if (n <= 0) return 0;
    let sum = 0;

    // Xử lý phần dư bằng bitwise AND (nhanh hơn phép chia lấy dư % cho 4)
    let rem = n & 3;
    while (rem > 0) {
        sum += n--;
        rem--;
    }

    // Unroll 4 bước mỗi vòng lặp
    while (n > 0) {
        sum += n + (n - 1) + (n - 2) + (n - 3);
        n -= 4;
    }

    return sum;
};

// Export for Node.js / Unit Test environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
}