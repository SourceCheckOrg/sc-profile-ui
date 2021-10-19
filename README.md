# SourceCheck Profile UI

SourceCheck Profile User Interface Application.


The application is based on the [Next.js](https://nextjs.org/) framework.

It's necessary to have the backend application (API server) running. More 
information on that can be found in the [HonorBox API](https://github.com/SourceCheckOrg/honorbox-api) repository. 


## Development environment setup

### Node.js

A recent version of Node.js is required to run the SourceCheck Profile UI application.

We recommended using Node Version Manager [nvm](https://github.com/nvm-sh/nvm)
to install Node.js in Linux and MacOS environments.

The code was created using `v14.15.3`.


### Installing SourceCheck Profile UI code

Clone this repository:
```
$ git clone https://github.com/SourceCheckOrg/sc-profile-ui.git
```

Install the dependencies
```
$ cd sc-profile-ui
$ npm install
```

Setup the environment variable `NEXT_PUBLIC_API_HOST` in the file
`.env.development`. It should point to the URL of the API server.


Start the Web UI:
```
$ npm run dev
```

The Web UI will be available on the following URL:

```
http://localhost:3001
```

If you want to run the application using a different port, please change the port
on the `dev` script in `package.json` 


### Metamask configuration

The usage of the application depends on the Metamask browser extension installed.

In order to deploy the verified profile to Polygon Mainnet it will be necessary also
some MATIC token to pay for the gas fee. 

More information on that will be added here soon.
