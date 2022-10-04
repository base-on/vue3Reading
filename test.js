import { dataToResponsive, effect } from './responsiveSystem.js'

let data = dataToResponsive({ name: 'Alice', age: 15, grade: 9 })

function f1() {
  console.log(`this student's name is ${data.name}.`)
}

function f2() {
  console.log(`this student's age is ${data.age}`)
}

effect(f1)
effect(f2)

setTimeout(() => {
  data.name = 'Jane'
}, 800);