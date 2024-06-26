const reviewsDB = require('../DB/reviewsDB');
const validator = require('validator');
const jwtService = require('../services/jwtService');

async function getReviews(req, res) {
	try {
		const result = await reviewsDB.findReviews();
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}

async function getReviewById(req, res) {
	const { id } = req.params;
	try {
		const result = await reviewsDB.findReviewById(id);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}

async function getReviewByMovieUserId(req, res) {
	const { idTMDB, idUser } = req.params;
	try {
		const result = await reviewsDB.findReviewByMovieUserId(idUser, idTMDB);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}

async function getReviewByMovieId(req, res) {
	const idTMDB = req.params.idTMDB;
	const page = req.query.page || 0;
	try {
		const result = await reviewsDB.findReviewByMovieId(page, idTMDB);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}
async function getReviewByWatched(req, res) {
	const idUser = req.params.idUser;

	try {
		const result = await reviewsDB.findReviewByWatched(idUser);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}
async function getReviewByPlanToWatch(req, res) {
	const idUser = req.params.idUser;

	try {
		const result = await reviewsDB.findReviewByPlanToWatch(idUser);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}
async function postReview(req, res) {
	const { authorization } = req.headers;
	const token = authorization.split(' ')[1];

	const result = jwtService.verifyToken(token);
		if (!result) {
		res.status(400).json({
			status: 'error',
			message: 'Invalid token',
		});
		return;
	}

	const { idTMDB, idUser, review, score, watched, planToWatch } = req.body;

	if (validator.isEmpty(idTMDB)) {
		res.status(400).json('Invalid Payload');
		return;
	}
	if (validator.isEmpty(idUser)) {
		res.status(400).json('Invalid Payload');
		return;
	}
	if (score < 0 || score > 10) {
		res.status(400).json('Invalid Score');
		return;
	}
	if (typeof watched !== 'boolean') {
		res.status(400).json('Invalid Request');
		return;
	}
	if (typeof planToWatch !== 'boolean') {
		res.status(400).json('Invalid Request');
		return;
	}
	if (watched === true && planToWatch === true) {
		res.status(400).json('Invalid Request');
		return;
	}

	const data = { idTMDB, review, score, watched, planToWatch };

	try {
		const result = await reviewsDB.insertReview(idUser, data);

		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}

async function putReview(req, res) {
	const { authorization } = req.headers;
	const token = authorization.split(' ')[1];

	const result = jwtService.verifyToken(token);
		if (!result) {
		res.status(400).json({
			status: 'error',
			message: 'Invalid token',
		});
		return;
	}
	const { id } = req.params;
	const { idTMDB, idUser, review, score, watched, planToWatch } = req.body;
	if (validator.isEmpty(idTMDB)) {
		res.status(400).json('Invalid Payload');
		return;
	}
	if (validator.isEmpty(idUser)) {
		res.status(400).json('Invalid Payload');
		return;
	}
	if (score < 0 || score > 10) {
		res.status(400).json('Invalid Score');
	}
	if (typeof watched !== 'boolean') {
		res.status(400).json('Invalid Request');
		return;
	}
	if (typeof planToWatch !== 'boolean') {
		res.status(400).json('Invalid Request');
		return;
	}
	if (watched === true && planToWatch === true) {
		res.status(400).json('Invalid Request');
		return;
	} 

	const data = { idTMDB, review, score, watched, planToWatch };
	console.log(data);
	try {
		await reviewsDB.updateReview(id, idUser, data);
		const result = await reviewsDB.findReviewById(id);
		if (!result) {
			res.status(404).end();
			z;
			return;
		}
		res.json(result);
	} catch (error) {
		res.status(500).send(error.message);
	}
}

async function deleteReview(req, res) {
	const { id } = req.params;

	try {
		const result = await reviewsDB.removeReview(id);
		res.json(result);
	} catch (error) {
		res.status(500).send(error.message);
	}
}

module.exports = {
	getReviews,
	getReviewById,
	getReviewByMovieUserId,
	getReviewByMovieId,
	getReviewByWatched,
	getReviewByPlanToWatch,
	postReview,
	putReview,
	deleteReview,
};
