const pool = require("../db/conn");

exports.studentsPost = async (req, res) => {
    const { name, email, subject, msg } = req.body;
    try {
        if (name == '') {
            res.status(400).send('please enter name');
        } else if (email == '') {
            res.status(400).send('please enter email');
        } else if (subject == '') {
            res.status(400).send('please enter subject');
        } else if (msg == '') {
            res.status(400).send('please enter msg');
        } else {
            let post = { name: name, email: email, subject: subject, msg: msg, datetime: new Date() };
            let sql = 'INSERT INTO contact SET ?'
            await pool.query(sql, post, (err, result, fields) => {
                if (err) throw err;
                res.status(200).send('Data saved successfully');
            })
        }
    } catch (e) {
        console.log(e)

        res.status(400).send(e);
    }
};

exports.studentsGet = async (req, res) => {
    try {

        await pool.query('SELECT * FROM contact', (err, result, fields) => {
            if (err) throw err;
            res.status(201).send(result);

            result.forEach(result => {
                console.log(result);
            });
        })
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.studentsGetSelect = async (req, res) => {
    try {
        const _id = req.params.id;
        await pool.query(`SELECT * FROM contact WHERE srno=${_id}`, (err, result, fields) => {
            if (err) throw err;
            if (result.length <= 0) {
                res.status(400).send('list not found');
            } else {
                res.status(201).send(result);
            }

            result.forEach(result => {
                console.log(result);
            });
        })
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.studentsUpdate = async (req, res) => {
    console.log('req', req);

    try {
        const _id = req.params.id;
        let email = req.body.email;
        await pool.query(`UPDATE contact SET email="${email}" WHERE srno=${_id}`, (err, result, fields) => {
            if (err) throw err;
            res.status(201).send(result);
        })
    } catch (e) {
        console.log('updateStudent', e)

        res.status(500).send(e);
    }
};

exports.studentsDel = async (req, res) => {
    try {
        const _id = req.params.id;
        await pool.query(`DELETE FROM contact WHERE srno=${_id}`, (err, result, fields) => {
            if (err) throw err;
            res.status(201).send(result);
        })
    } catch (e) {
        res.status(500).send(e);
    }
};