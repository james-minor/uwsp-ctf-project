import { strict as assert } from 'assert';
import Password from './Password';
import client from '../Client';
import Session from './Session';

describe('Session Class Unit Tests', () =>
{
	before(async () =>
	{
		await client.user.create({
			data: {
				username: 'admin', email: 'admin@example.com', passwordHash: '$2a$10$Y06Ua/0T/mixvsBXLYJRl.eyv5oTFTNBGcIDBWe6JHhPjO8D85RxK', role: 'ADMIN'
			},
		}).then(async (user) =>
		{
			await client.session.create({
				data: {
					key: '39dc68fe875a7e6334c464931616fc649667d4c81fa10fb7',
					userId: user.id,
				},
			});
		});
	});

	describe('create() Tests', () =>
	{
		assert(Session.create().length == 48);
	});

	describe('validate() Tests', () =>
	{
		it('Valid session key', async () =>
		{
			let result = await Session.validate('39dc68fe875a7e6334c464931616fc649667d4c81fa10fb7');

			assert.equal(result, true);
		});

		it('Invalid session key', async () =>
		{
			let result = await Session.validate('wrong');

			assert.equal(result, false);
		});

		it('Valid session key, ensuring user has elevated privileges', async () =>
		{
			let result = await Session.validate('39dc68fe875a7e6334c464931616fc649667d4c81fa10fb7', true);

			assert.equal(result, true);
		});

		it('Invalid session key, ensuring user has elevated privileges', async () =>
		{
			let result = await Session.validate('wrong', true);

			assert.equal(result, false);
		});
	});
});