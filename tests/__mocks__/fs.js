'use strict';

const fs = jest.genMockFromModule('fs');

fs.readdirSync = () => {
	throw new Error('OUR ERROR');
};

module.exports = fs;
