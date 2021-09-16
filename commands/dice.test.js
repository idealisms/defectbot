const dice = require('./dice');

test('roll the die', () => {
    dice('', (out) => {
        expect(out).toMatch(/You rolled a [1-6][.]/);
    });
});
