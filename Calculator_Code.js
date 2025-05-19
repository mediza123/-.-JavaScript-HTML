$(function () {
    let wasOperatorLast = false;
    let wasEqualsPressed = false;
    history_block.style.display = 'none';
    calculator.style.display = 'block';
    $('.buttons button').on('click', function () {
        const buttonValue = $(this).data('value');
        const inputDisplay = $('#input');
        const currentInput = inputDisplay.val();
        if (buttonValue == 'C') {
            inputDisplay.val('');
            wasOperatorLast = false;
            wasEqualsPressed = false;
            $('#history > div:nth-of-type(n+1)').remove();
            $('#history_block > div:nth-of-type(n+2)').remove();
            return;
        }
        if (buttonValue == 'AC') {
            inputDisplay.val('');
            wasOperatorLast = false;
            wasEqualsPressed = false;
            return;
        }
        if (buttonValue == '⌫') {
            inputDisplay.val(currentInput.slice(0,-1));
            return;
        }
        if (buttonValue == '=') {
            const result = evaluateExpression(currentInput);
            if (result != 'Ошибка') {
                addExpressionToHistory(`${currentInput} = ${result}`);
                inputDisplay.val(result);
            } else {
                inputDisplay.val('Ошибка');
            }
            wasEqualsPressed = true;
        } else {
            if (wasEqualsPressed) {
                inputDisplay.val('');
                wasEqualsPressed = false;
            }
            if (buttonValueIsOperator(buttonValue) && buttonValueIsOperator(getLastSymbol(currentInput))) {
                return;
            }
            if (buttonValue == '.') {
                if (wasOperatorLast || currentInput === '') {
                    return;
                }
                if (hasDecimalInLastNumber(currentInput)) {
                    return;
                }
            }
            inputDisplay.val(currentInput + buttonValue);
            wasOperatorLast = buttonValueIsOperator(buttonValue);
        }
    });
    $('.history button').on('click', function () {
        history_block.style.display = 'block';
        calculator.style.display = 'block';
    });
    $('.history_block button').on('click', function () {
        history_block.style.display = 'none';
        calculator.style.display = 'block';
    });
    function evaluateExpression(expression) {
        try {
            return math.evaluate(expression);
        } catch (error) {
            return 'Ошибка';
        }
    }
    function addExpressionToHistory(entry) {
        $('#history').append(`<div>${entry}</div>`);
        $('#history_block').append(`<div>${entry}</div>`);
    }
    function buttonValueIsOperator(value) {
        return ('+', '-', '*', '/').includes(value);
    }
    function getLastSymbol(str) {
        return str.slice(-1);
    }
    function hasDecimalInLastNumber(str) {
        const lastNumber = str.split(/[\+\-\*\/]/).pop();
        return lastNumber.includes('.');
    }
});
