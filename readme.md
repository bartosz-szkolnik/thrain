# Thrain

This is a simple Server App written in TypeScript and built on top of Deno. Still under development.

To Do:

- [ ] Fix the issue with expiring jwts
- [ ] Fix the children (they must be optional with jsx components)
- [ ] Fix the QueryBuilder types
- [x] Add more things to database module
- [ ] Add tests
- [ ] Get more stuff from Hydra
- [ ] Create something like a CDN to see how that thing works
- [ ] Add stale-while-revalidate and other stuff to it (https://www.youtube.com/watch?v=bfLFHp7Sbkg)
- [x] Create a load balancer to see how that thing works
- [x] Create a simple RPC server & client to see how that thing works
- [ ] (maybe) Create a css prop that will change that string into a style tag with those styles (preferably encapsulated)
- [x] Add the ability to hydrate client component (without JSX yet)
- [ ] Client components with JSX ((https://www.youtube.com/live/xt_iEOn2a6Y?si=wyUsCtO_m1qc2J37&t=23890))
- [x] Add `route()` to the router, which will add a prefix to all routes
- [ ] Add `watchFileSystem` to the `useRoutes` functionality, so adding new server components doesn't require restarting the server

## In the process of creation this thing I used these resources:

- How to create a Server in Deno - [
  Build a micro-framework from Scratch using Deno and Typescript](https://www.youtube.com/watch?v=xpPw749kDLo)
- How to add Middlewares to Server in Deno - [Build a micro-framework from Scratch using Deno and Typescript Part 2 - Middlewares](https://www.youtube.com/watch?v=peR8dPrFI4s)
- Templating Engine (with jsx-like syntax) - [Build your own React](https://pomb.us/build-your-own-react/)
- Caching & Expire Tags - [Remix Run - Introduction to HTTP Caching](https://www.youtube.com/watch?v=3XkU_DXcgl0)
- How to add a proxy in Deno - [Creating a HTTP proxy with Deno](https://blog.r0b.io/post/creating-a-proxy-with-deno/)
- How to create load balancing mechanism in Deno - [🌐 Node.js and the Art of Load Balancing: From Zero to Hero](https://www.youtube.com/watch?v=2oZJSePTivY)
- How to create a RPC server & client - [Lightweight Typescript RPC Example](https://github.com/JonathanTurnock/minimal-ts-rpc/tree/main)
- How to handle JSX.IntrinsicElements - [What is JSX.IntrinsicElements?](https://www.totaltypescript.com/what-is-jsx-intrinsicelements)
- More on HTTP Caching - [A complete guide to HTTP caching](https://www.jonoalderson.com/performance/http-caching/)
- Validation utility (zod-like) - taken from book TypeScript na Poważnie by Michał Miszczyszyn

I want to keep them here in case somebody else needs them
