const calcItems = Array.from(document.querySelectorAll('.calc-item'))
const calcAdd = document.querySelector('#calc-add__inner')
const calcTotal = document.querySelector('#calc-total')

let curNum = '',
  view = '',
  total = 0.0,
  prevTotal = '',
  calc = [],
  keyCheck = true

const mathArith = ['+', '-', '×', '÷']
const mathSyn = ['C', '+/-', '%', 'del']
const keyNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']

/* Re-arrange */
structure()


calcItems.forEach(item => item.addEventListener('click', heavy.bind(this, item.innerHTML)))
window.addEventListener('keypress', e => heavy(e.key))

calcAdd.scrollIntoView({inline: 'end'})

function heavy(inn) {

  keyCheck = true

  if (inn === '/') {
    inn = '÷'
  } else if (inn === '*') {
    inn = '×'
  } else if (inn === 'Enter') {
    inn = '='
  } else if (inn === 'c') {
    inn = 'C'
  } else if (inn === 'a' || inn === 'A') {
    inn = '%'
  } else if (inn === 'v' || inn === 'V') {
    inn = 'del'
  } else if (inn === 'n' || inn === 'N') {
    inn = '+/-'
  } else if (keyNums.indexOf(inn) === -1 && mathArith.indexOf(inn) === -1 && mathSyn.indexOf(inn) === -1 && inn !== '=') {
    keyCheck = false
  }
  
  if (keyCheck) {
    /* Calculations */
    // 1. Get innerHTML
    if (mathArith.indexOf(inn) === -1 && mathSyn.indexOf(inn) === -1) {
      if (inn == '=') {
        calc.push(parseFloat(curNum))
        curNum = ''
        total = genTotal(calc)
        prevTotal = total
      } else {
        curNum += inn
        if (typeof(prevTotal) === 'number') {
          calc = []
          view = ''

          prevTotal = ''
        }
      }
    } else if (mathArith.indexOf(inn) !== -1) {
      if (curNum !== '') {
        calc.push(parseFloat(curNum))
        curNum = ''
      }

      if (typeof(prevTotal) !== 'string') {
        calc = []
        calc.push(prevTotal)
        if (calc.length > 0) {
          calc.push(inn)
        }
      } else {
        if (typeof(calc[calc.length - 1]) === 'number') {
          calc.push(inn)
        } else {
          if (calc.length !== 0) {
            view = view.slice(0, view.length - 2)
            calc.pop()
            calc.push(inn)
          }
        }
      }

      prevTotal = ''
    } else if (mathSyn.indexOf(inn) !== -1) {
      synArr(mathSyn.indexOf(inn))
    }

    /* Display */
    // Get click innerHTML
    disp(inn)

    // Display item in mini screen 
    calcAdd.innerHTML = view

    // Big screen
    calcTotal.innerHTML = total
  }
}

function disp(str) {
  let arith = mathArith.indexOf(str),
      syn = mathSyn.indexOf(str)

  if (arith === -1 && syn === -1 && str !== '=') {
    view += str
  } else if (arith !== -1) { 

    // Check if the last element is also Math Arith
    if (calc.length === 2) {
      view = `${calc[0]}`
    } else if (calc.length === 0) {
      view = ''
    }

    view += ' ' + str + ' '
 
  } else if (syn !== -1) {
    if (syn === 0) {
      // C
      view = ''
    } else if (syn === 1) {
      // negate 
      let neg = 0
      
      if (typeof(calc[calc.length - 1]) === 'number') {
        neg = calc[calc.length - 1]

        if (view.lastIndexOf(' ') !== -1) {
          if (calc.length === 1) {
            view = `${neg}`
          } else {
            view = view.slice(0, view.lastIndexOf(' ') + 1)
            view += `${neg}`
          }
        } else {
          view = `${neg}`
        }
      }

    } else if (syn === 2) {
      // Percentage
      let perc = 0

      if (typeof(calc[calc.length - 1]) === 'number') {
        perc = calc[calc.length - 1]

        if (view.lastIndexOf(' ') !== -1) {
          if (calc.length === 1) {
            view = `${perc}`
          } else {
            view = view.slice(0, view.lastIndexOf(' ') + 1)
            view += `${perc}`
          }
        } else {
          view = `${perc}`
        }
      }

    } else if (syn === 3) {
      if (mathArith.indexOf(view[view.length - 2]) !== -1) {
        view = view.slice(0, view.length - 3)
      } else {
        view = view.slice(0, view.length - 1)
      }
    }
  }
}

function genTotal(arr) {
  let first = arr[0]

  for (var i = 2, str = 1; i < arr.length, str < arr.length; i += 2, str += 2) {
    /* 0 = +, 1 = -, 2 = *, 3 = /  */
    let curArith = mathArith.indexOf(arr[str])
    if (curArith === 0) {
      first += arr[i]
    } else if (curArith === 1) {
      first -= arr[i]
    } else if (curArith === 2) {
      first *= arr[i]
    } else if (curArith === 3) {
      first /= arr[i]
    }
  }

  return parseFloat(first.toFixed(4))
}

function synArr(num) {
  if (num == 0) {
    structure()
  } else if (num == 1) {
    negate()
  } else if (num == 2) {
    percen()
  } else if (num == 3) {
    del()
  }
}

function negate() {
  if (mathArith.indexOf(curNum) === -1 && mathSyn.indexOf(curNum) === -1 && curNum !== '') {
    let curA = parseFloat(curNum)
    calc.push(-curA)
    curNum = ''
  } else if (curNum === '' && typeof (prevTotal) === 'number') {
    calc = []
    calc.push(prevTotal)
    let last = calc[calc.length - 1]
    calc.pop()
    calc.push(-last)

    prevTotal = ''
  } else if (curNum === '' && typeof (calc[calc.length - 1]) === 'number') {
    let last = calc[calc.length - 1]
    calc.pop()
    calc.push(-last)
  }
}

function percen() {
  if (mathArith.indexOf(curNum) === -1 && mathSyn.indexOf(curNum) === -1 && curNum !== '') {
    let curA = parseFloat(curNum)
    curA = curA/100
    calc.push(curA)
    curNum = ''
  } else if (curNum === '' && typeof(prevTotal) === 'number') {
    calc = []
    calc.push(prevTotal)
    let last = calc[calc.length - 1] / 100
    calc.pop()
    calc.push(last)

    prevTotal = ''
  } else if (curNum === '' && typeof(calc[calc.length - 1]) === 'number') {
    let last = calc[calc.length - 1] / 100
    calc.pop()
    calc.push(last)
  }
}

function del() {
  if (curNum !== '') {
    curNum = curNum.slice(0, curNum.length - 1)
  } else if (calc.length > 0) {
    if (typeof(calc[calc.length - 1]) === 'number') {
      let actual = calc[calc.length - 1]
      curNum = `${actual}`
      calc.pop()
      curNum = curNum.slice(0, curNum.length - 1)
    } else {
      calc.pop()
    }
  }

  prevTotal = ''
}

function structure() {
  calcAdd.innerHTML = ''
  calcTotal.innerHTML = total
  curNum = ''
  total = 0.0
  calc = []
  view = ''
  prevTotal = ''
}