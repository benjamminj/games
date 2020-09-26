# 2. Use Blitz.js

Date: 2020-09-26

## Status

Accepted

## Context

Blitz.js is a fullstack React framework built on top of React.js. However, right now it's a little "bleeding edge" so chances are I won't be seeing too many production projects using it just yet.

Using it in this side project should give me a chance to play around with it and get some skills with it before it starts to get into the mainstream (and enterprise) Next.js community. I have a feeling that getting in on the ground floor of this will yield some valuable skills in the next couple years.

## Decision

I will use Blitz.js.

## Consequences

- This is a bleeding-edge technology without a `v1.0.0` release yet, so upgradeing dependencies might be painful. That risk is tolerable to this project though.
- Some things might be rough around the edges. This might mean reaching out on the `blitzjs` Slack group or contributing some of my own PRs.
- There will be a somewhat steeper learning curve at the beginning as I learn Blitz's API.
- When I get around to adding a DB, I'll probably need to scale up a Postgres or MySQL since that's what's supported by Prisma.
