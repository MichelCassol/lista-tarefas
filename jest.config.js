// Jest configuration file
module.exports = {
  // Set the test environment to Node.js
  testEnvironment: 'node',
  
  // Automatically clear mock calls and instances between tests
  clearMocks: true,
  
  // Specify the directories that Jest should search for tests
  roots: [
    './'
  ],
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Make Jest's global APIs available
  injectGlobals: true,
  
  // Verbose output
  verbose: true
}; 