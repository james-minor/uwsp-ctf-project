import { strict as assert } from 'assert';
import Password from './Password';
import client from '../Client';

describe('Password Class Unit Tests', () =>
{
	before(async () =>
	{
		await client.user.createMany({
			data: [
				{ username: 'user1', email: 'user1@example.com', passwordHash: '$2a$10$Y06Ua/0T/mixvsBXLYJRl.eyv5oTFTNBGcIDBWe6JHhPjO8D85RxK' },
				{ username: 'user2', email: 'user2@example.com', passwordHash: '$2a$10$5cVQ6gjifvNUrGAvzXlO/OncEYJ/6C886Up4neruSwQD9m0OH4Gs2' },
			],
		});
	});

	describe('create() Tests', () =>
	{
		it('Hashes string', async () =>
		{
			let result = await Password.create('Password123');

			assert(result.length === 60);
		});

		it('Hashes empty string', async () =>
		{
			let result = await Password.create('');

			assert(result.length === 60);
		});

		it('Ensuring passwords result in unique hashes', async () =>
		{
			let firstHash = await Password.create('Password1');
			let secondHash = await Password.create('Password1');

			assert.notEqual(firstHash, secondHash);
		});
	});

	describe('validate() Tests', () =>
	{
		it('Empty password', async () =>
		{
			assert.equal(await Password.validate('user1', ''), false);
		});

		it('Incorrect password', async () =>
		{

			assert.equal(await Password.validate('user1', 'wrong'), false);
		});

		it('Correct password', async () =>
		{
			assert.equal(await Password.validate('user1', 'password'), true);
		});

		it('Correct password, but incorrect username', async () =>
		{
			assert.equal(await Password.validate('user2', 'password'), false);
		});

		it('User that does not exist', async () =>
		{
			assert.equal(await Password.validate('null-user', 'password'), false);
		});
	});
});