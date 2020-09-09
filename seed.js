#!/usr/bin/env node
const { argv } = require('yargs');

if (!argv.siteDir) {
  throw new Error('Please provide --siteDir');
}

const path = require('path');
const { promises: fs } = require('fs');
const randomstring = require('randomstring');

const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Demo Site</title>
  </head>
  <body>
    REPLACE_WITH_CONTENT
  </body>
</html>`;

const getRandomSize = (min, max) => {
  return Math.random() * (max - min) + min;
};

const createFile = async ({ filePath, minSize, maxSize }) => {
  const size = Math.floor(getRandomSize(minSize, maxSize));
  const content = template.replace(
    'REPLACE_WITH_CONTENT',
    randomstring.generate(size),
  );
  await fs.writeFile(filePath, content);
};

const seedSite = async ({ dir, fileCount, minSize, maxSize, depth }) => {
  await fs.rmdir(dir, { recursive: true });
  await fs.mkdir(dir, { recursive: true });

  const filesPerDepth = Math.floor(fileCount / depth);
  console.log('Files per depth', filesPerDepth);

  let total = 0;
  let currentDepth = 0;
  let currentDir = dir;
  while (total < fileCount && filesPerDepth > 0) {
    const toCreate = new Array(Math.min(filesPerDepth))
      .fill(currentDir)
      .map((dir, index) => {
        const filename = index === 0 ? 'index.html' : `route_${index}.html`;
        return path.join(dir, filename);
      });

    await Promise.all(
      toCreate.map((filePath) => createFile({ filePath, minSize, maxSize })),
    );
    total = total + toCreate.length;
    currentDepth = currentDepth + 1;
    currentDir = path.join(currentDir, `depth_${currentDepth}`);
    console.log(currentDir);
    await fs.mkdir(currentDir, { recursive: true });
  }
};

const functionTemplate = () => {
  console.log('MESSAGE');
  return {
    statusCode: 200,
    body: 'pong',
  };
};

const seedFunctions = async ({ dir, count, size }) => {
  await fs.rmdir(dir, { recursive: true });
  await fs.mkdir(dir, { recursive: true });

  const functions = new Array(count).fill(dir).map((dir, index) => {
    const filename = `handler_${index}.js`;
    const message = randomstring.generate(size);
    return {
      handler: functionTemplate.toString().replace('MESSAGE', message),
      filePath: path.join(dir, filename),
    };
  });

  await Promise.all(
    functions.map(({ filePath, handler }) => {
      return fs.writeFile(filePath, `exports.handler = ${handler}`);
    }),
  );
};

const seed = async () => {
  await seedSite({
    dir: path.resolve(argv.siteDir),
    fileCount: argv.fileCount || 1000,
    minSize: (argv.minSize || 10) * 1024, // convert to KB
    maxSize: (argv.maxSize || 20) * 1024, // convert to KB
    depth: argv.depth || 5,
  });
  await seedFunctions({
    dir: path.resolve(argv.functionsDir || 'functions'),
    count: argv.functionCount || 10,
    size: (argv.functionSize || 1) * 1024, // convert to KB
  });
};

seed();
