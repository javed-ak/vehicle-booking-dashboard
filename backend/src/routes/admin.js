import { Router } from "express";
import { signUpInput, signinInput } from '@javed-ak/booking-inputs'
import jwt from "jsonwebtoken";
import { client } from "../db.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const body = req.body;
        const { success } = signUpInput.safeParse(body);

        if (!success) {
            return res.json({
                error: 'Inputs are not correct'
            })
        }

        const uuid = uuidv4();
        const admin = await client.query(`Insert into "Admin" (id,email,name, password) values ('${uuid}','${body.email}','${body.name}', '${body.password}') RETURNING *`);

        const token = jwt.sign(
            { id: admin.rows[0].id },
            process.env.JWT_SECRET || "",
        )
        return res.status(200).send("Bearer " + token);
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while Signing Up!' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const body = req.body;
        const { success } = signinInput.safeParse(body);

        if (!success) {
            return res.status(403).json({
                error: 'Inputs are not correct'
            })
        }

        const admin = await client.query(`SELECT * FROM "Admin" WHERE email='${body.email}' AND password='${body.password}'`);
        if (admin.rows.length === 0) {
            return res.status(403).json({
                error: 'Email or Password was wrong!'
            })
        }

        const token = jwt.sign(
            { id: admin.rows[0].id },
            process.env.JWT_SECRET || "",
        )
        return res.status(200).json({
            token: 'Bearer ' + token,
            name: admin.rows[0].name,
            email: admin.rows[0].email
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while Signing In!' });
    }
});

router.get('/', async (req, res) => {
    try {
        const admins = await client.query('SELECT id,name,email FROM "Admin"');

        res.json(admins.rows);

    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while fetching admins!' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await client.query(`DELETE FROM "Admin" WHERE id='${id}' RETURNING *`);

        if (admin.rows.length === 0) {
            return res.json({
                error: 'Admin not found!'
            })
        }

        res.json({
            msg: 'Admin Deleted Successfully!'
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while deleting admin!' });
    }
}
);

router.post('/vehicle', async (req, res) => {
    try {
        const body = req.body;

        const uuid = uuidv4();
        const vehicle = await client.query(`Insert into "Vehicle" (id,name) values ('${uuid}','${body.name}') RETURNING *`);
        return res.json({
            msg: 'Vehicle Added Successfully!'
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while adding vehicle!' });
    }
}
);

router.get('/vehicle', async (req, res) => {
    try {
        const vehicles = await client.query('SELECT id,name FROM "Vehicle"');
        res.json(vehicles.rows);
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while fetching vehicles!' });
    }
});

router.delete('/vehicle/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const vehicle = await client.query(`DELETE FROM "Vehicle" WHERE id='${id}' RETURNING *`);

        if (vehicle.rows.length === 0) {
            return res.json({
                error: 'Vehicle not found!'
            })
        }
        res.json({
            msg: 'Vehicle Deleted Successfully!'
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while deleting vehicle!' });
    }
}
);

export default router;
