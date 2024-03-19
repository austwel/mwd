import * as mysql from "mysql2";
import * as fs from "fs";
import waitPort from "wait-port";

const {
	MYSQL_HOST: HOST,
	MYSQL_USER: USER,
	MYSQL_PASSWORD: PASSWORD,
	MYSQL_DB: DB,
} = process.env;

let pool;

export async function init() {
    const host = HOST;
    const user = USER;
    const password = PASSWORD;
    const database = DB;

	await waitPort({
		HOST,
		port: 3306,
		timeout: 10000,
		waitForDns: true
	});

	pool = mysql.createPool({
		connectionLimit: 5,
		host,
		user,
		password,
		database,
		charset: 'utf8mb4'
	});

	return new Promise((acc, rej) => {
        console.log(`Connecting to db ${HOST}:3306`)
		pool.query(
			'CREATE TABLE IF NOT EXISTS customs (' +
            'id int NOT NULL AUTO_INCREMENT, ' +
            'message_id int, ' +
            'name varchar(255), ' +
            'waitlist varchar(1024), ' +
            'umbra1 varchar(50), ' +
            'astra1 varchar(50), ' +
            'umbra2 varchar(50), ' +
            'astra2 varchar(50), ' +
            'umbra3 varchar(50), ' +
            'astra3 varchar(50), ' +
            'umbra4 varchar(50), ' +
            'astra4 varchar(50), ' +
            'umbra5 varchar(50), ' +
            'astra5 varchar(50), ' +
            'PRIMARY KEY (id)' +
            ') DEFAULT CHARSET utf8mb4',
			err => {
				if (err) {
                    return rej(err);
                }

				acc();
			}
		)
		pool.query(
			'CREATE TABLE IF NOT EXISTS timers (' +
            'id int NOT NULL AUTO_INCREMENT, ' +
            'channel_id varchar(50), ' +
            'type varchar(3), ' +
            'PRIMARY KEY (id)' +
            ') DEFAULT CHARSET utf8mb4',
			err => {
				if (err) {
                    return rej(err);
                }

				console.log(`Connected to mysql db at host ${HOST}`);
				acc();
			}
		)
	});
}

export async function teardown() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

export async function getTimers() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM timers', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows
            )
        })
    })
}

export async function getCustom(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM customs WHERE message_id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows,
            );
        });
    });
}

export async function getCustoms() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM customs', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

export async function addCustom(game) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO customs (message_id, name, waitlist, captain_umbra, captain_astra, umbra, astra) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [game.message_id, game.name, game.waitlist, game.captain_umbra, game.captain_astra, game.umbra, game.astra],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

export async function editCustom(game) {
    return new Promise((acc, rej) => {
        pool.query(
            'UPDATE customs SET name=?, waitlist=?, captain_umbra=?, captain_astra=?, umbra=?, astra=? WHERE message_id=?',
            [game.name, game.waitlist, game.captain_umbra, game.captain_astra, game.umbra, game.astra, game.message_id],
            err => {
                if (err) return rej(err);
                acc();
            }
        )
    })
}

export async function removeCustom(id) {
    return new Promise((acc, rej) => {
        pool.query('DELETE FROM customs WHERE message_id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        })
    })
}