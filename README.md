# ESLint plugin tutorial

## What's this?

This is an example repository to explain how to create your ESLint rules.

## Why should we learn how to create custom ESLint rules?

Lint rules help to keep our codes' quality constant. Automatic code checking brings time for more productive activities, and also eliminates indivisual effects from code review.

Creating ESLint rules is a good subject to learn AST(Abstract Syntax Tree) analysis. Today, analysis of AST is the foundation of the JavaScript build ecosystem. There are many libraries using AST, such as Babel plugins, custom TypeScript transformers, prettier, webpack and so on. Your team's JavaScript gets improved significantly if you can control AST freely!

## Tutorial

[See guides](./guide/README.md).

## Getting started

This repository is also designed to work as a project template for custom ESLint rules.

If you want to start quickly, follow the procedure below:

- Clone this repository
- Remove `.git` and `guide` dirs
- Change pkg name via edit `package.json`
- Change and test rule codes under `src/rules` dir

This repository includes:

- TypeScript setting
- Jest
- GitHub actions configuration

## LICENSE

MIT
