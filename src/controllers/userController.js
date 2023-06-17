const pool = require("../db/conn");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const rendomstring = require('randomstring');
const sendMail = require('../helper/sendMail');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.userCreate = async (req, res) => {
    const { name, mobile_no, email, password } = req.body;
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        await pool.query(`SELECT * FROM account_create WHERE email = ${pool.escape(email)} OR mobile_no = ${pool.escape(mobile_no)};`,
            (err, result) => {
                if (result && result.length) {
                    return res.status(409).send({ msg: 'This mail id and mobile no is already in use!' })
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                return res.status(400).send({ msg: err })
                            }
                            else {
                                let post = {
                                    name: name, mobile_no: mobile_no, email: email, password: hash, is_verified: 0
                                };
                                let sql = 'INSERT INTO account_create SET ?'
                                pool.query(sql, post, (err, result) => {
                                    if (err) {
                                        return res.status(400).send({ msg: err })
                                    }

                                    let mailSubject = 'Mail Verification';
                                    const rendomToken = rendomstring.generate();
                                    let contant = '<p>Hii ' + name + ', Please <a href="http://localhost:3002/mail-verification?token=' + rendomToken + '"> verify</a> your mail</p>';
                                    sendMail(email, mailSubject, contant);

                                    pool.query('UPDATE account_create SET token=? where email=?', [rendomToken, email], function (err, result) {
                                        if (err) {
                                            return res.status(400).send({ msg: err });
                                        }
                                    })

                                    return res.status(200).send({
                                        msg: 'User has been registered with us!',
                                    });
                                })
                            }
                        })
                    })
                }
            }
        );
    } catch (e) {
        console.log(e)

        res.status(400).send(e);
    }
};

exports.verifyMail = (req, res) => {
    var token = req.query.token;

    pool.query('SELECT * FROM account_create where token=? limit 1', token, function (err, result) {
        if (err) {
            console.log(err.message)
        }

        if (result.length > 0) {
            pool.query(`UPDATE account_create SET token = null, is_verified = 1 WHERE id = ${result[0].id}`);
            return res.render('mail-verification', { message: 'Mail Verifiled successfully!' })
        }
        else {
            return res.render('404')
        }
    })
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        await pool.query(`SELECT * FROM account_create WHERE email = ${pool.escape(email)};`,
            (err, result) => {
                if (err) {
                    return res.status(400).send({ msg: err })
                }

                if (!result.length) {
                    return res.status(401).send({ msg: 'Email or password incorrect' })
                }

                bcrypt.compare(
                    password,
                    result[0]['password'],
                    (bErr, bResult) => {
                        if (bErr) {
                            return res.status(400).send({ msg: bErr });
                        }

                        if (bResult) {
                            const token = jwt.sign({ id: result[0]['id'], is_admin: result[0]['is_admin'] }, JWT_SECRET, { expiresIn: '1h' });
                            pool.query(`UPDATE account_create SET last_login = now() WHERE id = '${result[0]['id']}'`);
                            return res.status(200).send({ msg: 'logged In', token, user: result[0] });
                        }

                        return res.status(401).send({ msg: 'Email or password incorrect' });
                    }
                )
            })

    }
    catch (e) {
        console.log(e)

        res.status(400).send(e);
    }
}

exports.userList = async (req, res) => {
    try {
        const authToken = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(authToken, JWT_SECRET);

        await pool.query('SELECT * FROM account_create where id=?', decodedToken.id, function (err, result) {
            if (err) throw err;
            return res.status(200).send({ success: true, data: result[0], message: 'List get successfull' });
        })

    }
    catch (e) {
        console.log(e)

        res.status(400).send(e);
    }
}
