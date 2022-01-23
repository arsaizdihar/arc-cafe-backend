# ARC Cafe Project Backend

This site is using express.js framework with prisma as ORM (PosgreSQL) completed with typescript. 


## Deployment
Deployed to DigitalOcean Virtual Machine (Droplets) using pm2 and nginx with Continuous Delivery using github workflows.

After every push, github action will login via ssh to server VM, pull the update, rebuild the typescript files, and then restart pm2.

Deploy URL: <a href="https://arc.arsaizdihar.me">arc.arsaizdihar.me</a>

## Libraries
- Express.js
- Prisma
- Typescript
- express-validator
- jsonwebtoken
- etc.

## Authentication Method
For authentication, this project use JSONWebToken (jwt) and stored it in HttpOnly cookie. The cookie will be auto refreshed after half of the expiration time.