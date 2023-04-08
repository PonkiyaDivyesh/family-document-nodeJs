const pool = require("../db/conn");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const rendomstring = require('randomstring');
const sendMail = require('../helper/sendMail');

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
                    bcrypt.hash(password, 10, (err, hash) => {
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
    console.log('res', res);

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



// exports.studentsGet = async (req, res) => {
//     try {

//         await pool.query('SELECT * FROM contact', (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);

//             result.forEach(result => {
//                 console.log(result);
//             });
//         })
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };

// exports.studentsGetSelect = async (req, res) => {
//     try {
//         const _id = req.params.id;
//         await pool.query(`SELECT * FROM contact WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             if (result.length <= 0) {
//                 res.status(400).send('list not found');
//             } else {
//                 res.status(201).send(result);
//             }

//             result.forEach(result => {
//                 console.log(result);
//             });
//         })
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

// exports.studentsUpdate = async (req, res) => {
//     console.log('req', req);

//     try {
//         const _id = req.params.id;
//         let email = req.body.email;
//         await pool.query(`UPDATE contact SET email="${email}" WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);
//         })
//     } catch (e) {
//         console.log('updateStudent', e)

//         res.status(500).send(e);
//     }
// };

// exports.studentsDel = async (req, res) => {
//     try {
//         const _id = req.params.id;
//         await pool.query(`DELETE FROM contact WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);
//         })
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };