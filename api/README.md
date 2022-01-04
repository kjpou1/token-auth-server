# Token Authentication Server API

## Quickstart

1. Use the [Drake](https://github.com/srackham/drake) task runner module to
   build and test auth server library modules and CLIs for Deno.

       deno run -A Drakefile.ts <Task>

| Task            | Description                          |
| --------------- | ------------------------------------ |
| start           | Run API                              |
| denon           | Run API via denon for development    |
| mongodb         | Start mongodb server for development |
| mongodb-stop    | Stop mongodb server for development  |
| cache           | Cache and lock dependencies          |
| denon-install   | Install denon for development        |
| mongodb-install | Install mongodb for development      |

## Common error HTTP status codes include [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status):

- 400 Bad Request – This means that client-side input fails validation.
- 401 Unauthorized – This means the user isn’t not authorized to access a
  resource. It usually returns when the user isn’t authenticated.
- 403 Forbidden – This means the user is authenticated, but it’s not allowed to
  access a resource.
- 404 Not Found – This indicates that a resource is not found.
- 500 Internal server error – This is a generic server error. It probably
  shouldn’t be thrown explicitly.
- 502
  [Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502) –
  This indicates an invalid response from an upstream server.
- 503 Service Unavailable – This indicates that something unexpected happened on
  server side (It can be anything like server overload, some parts of the system
  failed, etc.).

### Forbidden, Unauthorized, or What Else?

[Forbidden, Unauthorized, or What Else?](https://auth0.com/blog/forbidden-unauthorized-http-status-codes/)

## Best practices

- [Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-accept-and-respond-with-json)
- [RESTful web API design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## HATEOAS

[Use HATEOAS to enable navigation to related resources](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#use-hateoas-to-enable-navigation-to-related-resources)

## --unstable flag

The unstable flag is needed now for using the
[bcrypt library](https://github.com/JamesBroadberry/deno-bcrypt/issues/24)
Review this once there is a new release.

## Style Guide ✨

https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md

## JWT Handling

[The Ultimate Guide to handling JWTs on frontend
clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/#silent_refresh)

[The Ultimate Guide to JWT server-side auth (with refresh tokens)](https://katifrantz.com/the-ultimate-guide-to-jwt-server-side-authentication-with-refresh-tokens)

[OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#section-8)

[What Are Refresh Tokens and How to Use Them Securely](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

## CSRF

https://deno.land/x/drash_middleware@v0.7.10/csrf
https://en.wikipedia.org/wiki/Cross-site_request_forgery
https://github.com/Octo8080/deno-csrf

## Running from dockerfile

If one really wants to run from `Dockerfile` then do the following:

First start the database service from the compose file

```
docker-compose up --build api-mongo
```

Then the following but do not forget to replace the IP address for the mongo db.

```
cd api
docker image build -t token-auth-server . && docker container run -it --init -p 3001:3001 -e URI=http://0.0.0.0:3001 --rm --name token-auth-server2 -v "$PWD:/api" -e MONGO_URL=mongodb://`{ Local HOST IP ADDRESS}`:27017 token-auth-server
```

```
docker container exec -it `container-name` sh
```

## Docker compose commands

# Rebuild

```
docker-compose down && docker-compose build
```

- or -

  ```
  docker-compose up --build
  ```

Start the compose containers without building

```
docker-compose up
```
