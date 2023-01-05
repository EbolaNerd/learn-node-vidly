const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.collection.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            
            const res = await request(server).get('/api/genres/' + genre._id);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return status 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST / ', () => {
        let token;
        let name;

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1'});
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id ', () => {
        let token;
        let newName;
        let genre;
        let genreId;        

        const exec = () => {
            return request(server)
                .put(`/api/genres/${genreId}`)
                .set('x-auth-token', token)
                .send({ name: newName });
        };

        beforeEach(async () => {
            //Populate database with a genre before each test is run.
            genre = new Genre({name: 'genre1'});
            await genre.save();

            //Generate happy path state
            token = new User().generateAuthToken();
            genreId = genre._id;
            newName = 'UpdatedName';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            genreId = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre not found', async () => {
            genreId = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            const res = await exec();
            
            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if input is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });

    });

    describe('DELETE /:id ', () => {
        let token;
        let genre;
        let genreId;  

        const exec = () => {
            return request(server)
                .delete(`/api/genres/${genreId}`)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
              //Populate database with a genre before each test is run.
              genre = new Genre({name: 'genre1'});
              await genre.save();
  
              //Generate happy path state
              token = new User({ isAdmin: true }).generateAuthToken();
              genreId = genre._id;
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if client is not admin', async () => {
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            genreId = 1;
            
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            genreId = mongoose.Types.ObjectId();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();

            const deletedGenre = await Genre.findById(genreId);

            expect(deletedGenre).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});