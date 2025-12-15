module.exports = {
	apps: [
		{
			name: 'nehmeailabs.com',
			script: 'build',
			interpreter: 'node',
			env: {
				NODE_ENV: 'production',
				HOST: '127.0.0.1',
				PORT: 3005
			}
		}
	]
};


