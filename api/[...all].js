module.exports = async (req, res) => {
	try {
		const { default: app } = await import("../Backend/server.js");
		return app(req, res);
	} catch (error) {
		return res.status(500).json({
			message: "API bootstrap failed",
			error: error.message,
		});
	}
};
