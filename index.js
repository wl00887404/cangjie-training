const fs = require('fs')
let keys = {}
"日月金木水火土竹戈十大中一弓人心手口尸廿山女田難卜重"
    .split('')
    .forEach((el, i) => {
        keys[String.fromCharCode(97 + i)] = el
    })

let dailywords = fs
    .readFileSync('./src/教育部4808個常用字.csv', 'utf8')
    .split("\n")
    .map(el => el[el.length - 1])

let dict = fs
    .readFileSync('./src/cangjie5.dict.yaml', 'utf8')
    .split("\n")
    .filter((el, i, a) => i >= 43 && i < a.length - 1)
    .map(el => {
        let split = el.split("\t")
        return {word: split[0], input: split[1]}
    })
    .filter(el => dailywords.includes(el.word))

let cp950 = {}
fs
    .readFileSync('./src/cp950-u2b.txt', 'utf8')
    .split("\n")
    .filter((el, i, a) => i >= 1 && i < a.length - 1)
    .forEach(el => {
        let split = el
            .split(" ")
        cp950[String.fromCharCode( parseInt(split[1]))] = split[0].slice(2)
    })
fs.writeFileSync('./build/dict.json', JSON.stringify(dict))
fs.writeFileSync('./build/keys.json', JSON.stringify(keys))
fs.writeFileSync('./build/cp950.json', JSON.stringify(cp950))
