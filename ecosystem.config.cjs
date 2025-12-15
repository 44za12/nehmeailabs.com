module.exports = {
	apps: [
		{
			name: 'nehmeailabs.com',
			// adapter-node outputs build/index.js
			script: 'build/index.js',
			// Prefer nvm node if available when starting pm2
			interpreter: process.env.NVM_BIN ? `${process.env.NVM_BIN}/node` : 'node',
			env: {
				NODE_ENV: 'production',
				HOST: '127.0.0.1',
				PORT: 3005
			}
		}
	]
};


