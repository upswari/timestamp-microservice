const express = require('express'),
    app = express()

app.get('/api/timestamp', (req, res) => {
    res.json({ "unix": new Date().getTime(), "utc": new Date().toUTCString() })

}).get('/api/timestamp/:date_string', (req, res, next) => {
    let date_string = req.params.date_string,
        r_unix = /[0-9]{13}/,
        r_utc = /\d{4}[-]\d{1,}[-]\d{2}/,
        valid_unix = date_string.match(r_unix) != null ? date_string.match(r_unix).map(x => x).toString() : null,
        valid_utc = date_string.match(r_utc) != null ? date_string.match(r_utc).map(x => x).toString() : null

    if (valid_unix != null && valid_unix == date_string) {
        date_string = parseInt(date_string)
        req.data = { "unix": new Date(date_string).getTime(), "utc": new Date(date_string).toUTCString() }
        next()
    } else if (valid_utc != null && (new Date(date_string).toUTCString() != 'Invalid Date')) {
        req.data = { "unix": new Date(date_string).getTime(), "utc": new Date(date_string).toUTCString() }
        next()
    } else {
        req.data = { "error": "Invalid Date" }
        next()
    }

}, (req, res) => {
    res.json(req.data)

})


app.listen(process.env.PORT || 3000, () => console.log('Running!'))