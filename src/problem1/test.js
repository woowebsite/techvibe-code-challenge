const assert = require('assert');
const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./index');

const functions = [
    { name: 'sum_to_n_a (Formula)', fn: sum_to_n_a },
    { name: 'sum_to_n_b (Tight Loop)', fn: sum_to_n_b },
    { name: 'sum_to_n_c (4x Unrolling)', fn: sum_to_n_c },
];

console.log('==============================================');
console.log('🧪 RUNNING UNIT TESTS FOR PROBLEM 1');
console.log('==============================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(testName, testFn) {
    totalTests++;
    try {
        testFn();
        console.log(`  ✅ PASS: ${testName}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ FAIL: ${testName}`);
        console.error(`     Error: ${err.message}\n`);
    }
}

// 1. Test các trường hợp cơ bản
functions.forEach(({ name, fn }) => {
    console.log(`[Testing ${name}]`);

    runTest(`${name} - should return 15 for n = 5`, () => {
        assert.strictEqual(fn(5), 15);
    });

    runTest(`${name} - should return 1 for n = 1`, () => {
        assert.strictEqual(fn(1), 1);
    });

    runTest(`${name} - should return 55 for n = 10`, () => {
        assert.strictEqual(fn(10), 55);
    });

    runTest(`${name} - should return 5050 for n = 100`, () => {
        assert.strictEqual(fn(100), 5050);
    });

    // 2. Test Edge Cases (Số 0 và số âm)
    runTest(`${name} - should return 0 for n = 0`, () => {
        assert.strictEqual(fn(0), 0);
    });

    runTest(`${name} - should return 0 for negative input (n = -5)`, () => {
        assert.strictEqual(fn(-5), 0);
    });

    // 3. Test với số lớn
    runTest(`${name} - should return 5000050000 for n = 100000`, () => {
        assert.strictEqual(fn(100000), 5000050000);
    });

    console.log('');
});

// 4. Test tính nhất quán giữa cả 3 hàm với dải số ngẫu nhiên từ 1 đến 500
console.log('[Cross-Validation]');
runTest('All 3 functions must produce identical results for n from 1 to 500', () => {
    for (let n = 1; n <= 500; n++) {
        const resA = sum_to_n_a(n);
        const resB = sum_to_n_b(n);
        const resC = sum_to_n_c(n);

        assert.strictEqual(resA, resB, `Mismatch between A and B at n = ${n}`);
        assert.strictEqual(resB, resC, `Mismatch between B and C at n = ${n}`);
    }
});

console.log('\n==============================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} Passed`);
console.log('==============================================');

if (passedTests !== totalTests) {
    process.exit(1);
}
