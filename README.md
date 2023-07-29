# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/
deployment/docker) for more information.

<!-- Notes for Reuben:

This project was really quite an overall deep dive. I feel like tRPC is the biggest new feature that I'm still trying to wrap my head around.

I've finished the youtube tutorial, but as a way to really test my knowledge, now I'm gonna go back and add more features. First starting with a delete button. This will have a few
parts:

- on the front end, displaying a little "X" in the top right hand corner of the tweet card
- some functionality to do with on click. It must trigger a function that sends a DELETE request to the api. Essentially it finds that tweet in the Db (by ID?), then removes it. Then we want to auto refresh the page so that is seemlessly disappears.

I thought it would be fun to make it a non protected procedure at first to keep it simple - anyone can delete anyone else's tweet without having to be logged in. Starting on the backend.

Would I need to edit the code in "tweet.ts" in the routers folder to start with?

Chur!! -->

<!-- Shortcut to open up Prisma studio from terminal = npx prisma studio -->

