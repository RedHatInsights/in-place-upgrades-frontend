![tests](https://github.com/RedHatInsights/in-place-upgrades-frontend/actions/workflows/tests.yml/badge.svg)
[![codecov](https://codecov.io/github/RedHatInsights/in-place-upgrades-frontend/branch/main/graph/badge.svg?token=WXB9W9E9ZU)](https://codecov.io/github/RedHatInsights/in-place-upgrades-frontend)


# In-place Upgrades frontend for Insights

User friendly experience for all customers who want to perform in-place upgrades on console.redhat.com.

Our page groups multiple existing components of Insights on one page with a goals:

* to see all systems that are (or can be) available for upgrade in one place
* to see all available tasks and remediations relatd to upgrades in one place
* to see recommended workflow for upgrading registred systems - starting with preupgrade analysis and ending with post-upgrade steps

## Local development

**The app is not deployed yet, we are creating simple POC right now**

### [One-time-setup] Initial etc/hosts setup

In order to access the https://[env].foo.redhat.com in your browser, you have to add entries to your `/etc/hosts` file. This is a **one-time** setup that has to be done only once (unless you modify hosts) on each machine.

To setup the hosts file run following command:
```bash
npm run patch:hosts
```

If this command throws an error run it as a `sudo`:
```bash
sudo npm run patch:hosts
```

### Set up chrome-service-backend for accessing the route of our app

You need to fork and clone the [chrome-service-backend](https://github.com/RedHatInsights/chrome-service-backend/tree/main) repository, prefferably use [changes on this branch to get started](https://github.com/andywaltlova/chrome-service-backend/tree/add-upgrades-nav-modules) or make similar changes in your fork.

Then follow [these steps](https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/cloud-services-config.md#serving-files-locally) (you don't have to add routes, it is already done in [fec.config.js](/fec.config.js)), probably easiest is to just run `make dev-static-node port=9999` inside the cloned repository (if you want to use different port then you have to update [fec.config.js](/fec.config.js) in this repository)

### Getting started

1. ```npm install```

2. ```npm run start```

3. Open browser in URL listed in the terminal output

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)

There is also pre-commit in place that runs lint and test (set up via [husky](https://github.com/typicode/husky)).