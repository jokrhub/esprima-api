const express = require('express')
var esprima = require('esprima')
var program = 'const answer = 42'

// var tokens = esprima.tokenize(program)

app = express()
app.use(require('body-parser').urlencoded({ extended: false }));

const PORT = 3000

let test_str = `<!doctype html><html><head><title>JavaScript and single quote injection in JS block (js.6)</title></head><body>

<script language="javascript">
var f = {
    date: "",
    week: "1",
    bad: alert(1),
    phase: "2",
  };
</script>

Hello!<BR> 
This test demonstrates exploitable Injection due to unsafe handling of single quotes inside of a Javascript block.

</body></html>
`

// var match_str = test_str.match(/"javascript">((.|\n)*)<\/script>/)[1]
// ps = esprima.parseScript(match_str)
// console.log(esprima.tokenize(match_str))

app.get('/', (req, res) => {
    res.json(tokens)
})

app.post('/parse', (req, res) => {
    console.log("parsing........")
    let { code, target } = req.body

    code = code.match(/"javascript">((.|\n)*)<\/script>/)[1]

    console.log(code)

    try {
        esprima.parseScript(code)
    } catch (error) {
        console.log(error)
        return res.send("Empty")
        
    }

    tokens = esprima.tokenize(code)

    console.log(tokens)

    tokens.forEach(token => {
        if (token.value == target)
            return res.send(token.type)
    });

    return res.send("Empty")

})

app.post('/context', (req, res) => {
    console.log("checking context........")

    let { code, target } = req.body

    try {
        console.log("code", req.body)
        code = code.match(/"javascript">((.|\n)*)<\/script>/)[1]
        console.log(code)
    
        tokens = esprima.tokenize(code)
    
        console.log(tokens)
    
        tokens.forEach(token => {
            if (token.value.includes(target)){
                if (token.value.charAt(0) == "\"")
                    return res.send("\"")
                else if (token.value.charAt(0) == "'")
                    return res.send("'")
                else 
                    return res.send("")
            }
        });
    } catch (error) {
        return res.send("")
    }

   

    // return res.send("Empty")

})


app.listen(PORT, (err) => {
    if (!err) console.log("Started...")
})