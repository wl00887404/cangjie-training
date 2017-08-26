let targets = ["./dict.json", "./keys.json", "./cp950.json"].map(uri => fetch(uri).then(res => res.json()))
let getQueryUri = (charCode) => `http://input.foruto.com/cjdict/Images/CJZD_JPG/${charCode}.JPG`
Promise
    .all(targets)
    .then(ress => {
        let game = new Game({dict: ress[0], keys: ress[1], cp950: ress[2]})
        window.game = game
        game.init()
        input.oninput = game.oninput
        input.onkeydown = game.onkeydown
        h3.onclick = () => input.focus()
    })

class Game {
    constructor({dict, keys, cp950}) {
        Object.assign(this, {dict, keys, cp950})
        let {_random, _convert2Cangjie, onkeydown, oninput} = this
        this._random = _random(dict.length)
        this._convert2Cangjie = _convert2Cangjie(keys)
        this.onkeydown = onkeydown.bind(this)
        this.oninput = oninput.bind(this)

    }
    _convert2Cangjie(keys) {
        return (key) => {
            return keys[key]
        }
    }
    _random(length) {
        return () => {
            return Math.floor(Math.random() * 19960419) % length
        }
    }
    _query(char) {
        return this.cp950[char]
    }
    render() {
        let {_convert2Cangjie} = this
        h2.innerHTML = this.topic.word
        let accInput = this
            .accInput
            .split('')
            .map(el => _convert2Cangjie(el))
            .join('')
        h3.innerHTML = accInput.slice(0, accInput.length + this.cursor) + "<span class='cursor'></span>" + accInput.slice(accInput.length + this.cursor)
    }

    init() {
        this.make()
        this.accInput = ""

        input.value = ""
        h4.innerHTML = ""
        img.src = ""

        this.cursor = 0
        this.render()
    }
    make() {
        this.topic = this.dict[this._random()]
    }
    submit() {
        let {_convert2Cangjie} = this
        if (this.accInput == this.topic.input) {
            game.init()
        } else {
            h4.innerHTML = this
                .topic
                .input
                .split('')
                .map(el => _convert2Cangjie(el))
                .join('')
            img.src = getQueryUri(this._query(this.topic.word))

        }
    }
    oninput({target}) {
        target.value = target
            .value
            .split('')
            .filter(el => el.toUpperCase().charCodeAt() > 64 && el.toUpperCase().charCodeAt() < 91)
            .join('')
        this.accInput = target.value
        target.setSelectionRange(this.accInput.length + this.cursor, this.accInput.length + this.cursor)
        this.render()
    }
    onkeydown({keyCode, key}) {
        switch (keyCode) {
            case 13:

                {
                    this.submit();

                    break
                }
            case 37:
                {
                    this.cursor -= 1
                    this.render()
                    break

                }
            case 39:
            case 46:
                {
                    if (this.cursor < 0) {
                        this.cursor += 1
                        this.render()
                    }
                    break
                }
        }
    }
}